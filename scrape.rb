require 'rubygems'
require 'nokogiri'
require 'logger'
require 'open-uri'
require 'mechanize'

# The Yale OCI site has an INCREDIBLY ugly and outdated HTML structure,
# based on tables and utterly non-semantic. That's why this scraper is
# so convoluted and fragile. It has to be updated every semester.

class Scrape

  def self.scrape_range(first, last, semester_id)
    #example semester ID: 201301 for Spring 2013

    log = Logger.new('scrape-log.txt')

    arts = {:name => 'arts', :departments => ['ARCH','ART','CPAR','DRAM','DRST','FILM','MUSI','THST']}
    lang = {:name => 'lang', :departments => ['AKKD','ARBC','BNGL','CHNS','CSBK','CSBR','CSCC','CSDC','CSES','CSJE','CSMC','CSPC','CSSM','CSSY','CSTC','CSTD','CSYC','CZEC','DUTC','FREN','GMAN','GREK','HEBR','HNDI','INDN','ITAL','JAPN','KREN','LATN','MGRK','NAVY','PERS','PLSH','PORT','RUSS','SKRT','SLAV','SPAN','SPEC','SWAH','TAML','TKSH','USAF','VIET','YORU','ZULU']}
    sosc = {:name => 'sosc', :departments => ['ACCT','ANTH','CGSC','CHLD','ECON','EDST','EGYP','ENVE','F&ES','HLTH','LING','MGT','PLSC','PSYC','SOCY','STCY']}
    hums = {:name => 'hums', :departments => ['AFAM','AFST','AMST','ARCG','CLCV','CLSS','EALL','EAST','ENGL','EP&E','ER&M','GLBL','GMST','HIST','HSAR','HSHM','HUMS','JDST','LAST','LITR','MMES','NELC','PHIL','RLST','RSEE','SAST','WGSS']}
    sci = {:name => 'sci', :departments => ['AMTH','APHY','ASTR','BENG','BIOL','CENG','CHEM','CPSC','E&EB','EENG','ENAS','EVST','G&G','MATH','MB&B','MCDB','MENG','OPRS','PHYS','SCIE','STAT']}

    (first..last).each do |course_id|
      begin
        page = Nokogiri::HTML(open("http://students.yale.edu/oci/resultDetail.jsp?course=#{course_id}&term=#{semester_id}"))
      rescue
        log.error "Couldn't find #{course_id}"
        next
      end

      begin
        metadata_table = page.css('table')[1]
        left_column = metadata_table.css('table')[0]
        right_column = metadata_table.css('table')[1]

        left_column_rows = left_column.css('tr')
        right_column_rows = right_column.css('tr')

        data = left_column_rows[0].css('td.RowText').text.gsub(/\s+/, ' ').strip
        department = data.split[0]
        number = data.split[1]

        name = left_column_rows[1].text.gsub(/\s+/, ' ').strip

        professors_array = Array.new
        left_column_rows[2].css('a').each do |p|
          professors_array << p.text
        end
        professors = professors_array.join(',')

        hours_array = Array.new
        hours_raw = left_column_rows[3].to_s
        hours_split = hours_raw.split('<br>')
        hours_split.each do |line|
          hours_array << line.gsub(/<\/?[^>]*>/, "").strip
        end
        hours = hours_array.join(',')

        has_final = true
        permission_required = false
        meets_during_rp = false
        skills = []
        areas = []
        notices_array = []

        right_column_rows.each do |row|
          row = row.text

          if row.include? 'Skills'
            if row.upcase.include? 'WR'
              skills << 'WR'
            end

            if row.upcase.include? 'QR'
              skills << 'QR'
            end

            if row.upcase.include? 'L1'
              skills << 'L1'
            end

            if row.upcase.include? 'L2'
              skills << 'L2'
            end

            if row.upcase.include? 'L3'
              skills << 'L3'
            end

            if row.upcase.include? 'L4'
              skills << 'L4'
            end

            if row.upcase.include? 'L5'
              skills << 'L5'
            end
          elsif row.include? 'Areas'
            if row.upcase.include? 'HU'
              areas << 'Hu'
            end

            if row.upcase.include? 'SO'
              areas << 'So'
            end

            if row.upcase.include? 'SC'
              areas << 'Sc'
            end
          elsif !(row.include? 'Spring 2013')
            notices_array << row.gsub(/\s+/, ' ').strip
          end
        end

        if notices_array.include? 'Permission of instructor required'
          permission_required = true
        else
          permission_required = false
        end

        if notices_array.include? 'No regular final examination'
          no_exam = true
        else
          no_exam = false
        end

        if notices_array.include? "Meets during reading period"
          reading_period = true
        else
          reading_period = false
        end

        skills_string = skills.join(',')
        areas_string = areas.join(',')
        notices = notices_array.join(',')

        description_array = Array.new
        page.css('table')[4].css('td').each do |td|
          description_array << td.text.strip unless td.text.gsub(/\s+/, ' ').strip.empty?
        end
        description = description_array.join("\n")

        #set category
        category = 'other' #default
        [arts, lang, sosc, hums, sci].each do |category_hash|
          if category_hash[:departments].include? department
            category = category_hash[:name]
          end
        end

        #see if course is cancelled
        if page.text.downcase.include? "cancelled"
          cancelled = true
        else
          cancelled = false
        end

      rescue
        log.error "Couldn't process #{course_id}"
        next
      end

      begin
        c = Course.find_or_create_by_oci_id(course_id)
        c.update_attributes(
          :department => department,
          :number => number.to_i,
          :name => name,
          :professors => professors,
          :hours => hours,
          :notices => notices,
          :skills => skills_string,
          :areas => areas_string,
          :desc => description,
          :permission_required => permission_required,
          :no_exam => no_exam,
          :reading_period => reading_period,
          :semester => semester_id,
          :category => category,
          :cancelled => cancelled
        )

        log.info "Saved #{course_id} (#{department} #{number})"
      rescue
        log.error "Couldn't save #{course_id}"
        next
      end
    end
  end

end