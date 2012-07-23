require 'rubygems'
require 'nokogiri'
require 'logger'
require 'open-uri'

class Scrape

  def self.scrape_range(first, last)
    log = Logger.new('log.txt')

    (first..last).each do |course_id|
      unless Course.find_by_oci_id(course_id)
        begin
          page = Nokogiri::HTML(open("http://students.yale.edu/oci/resultDetail.jsp?course=#{course_id}&term=201203"))
        rescue
          log.error "Couldn't find #{course_id}"
          next
        end

        begin
          data = page.css('td:nth-child(1) tr:nth-child(1) .RowText').text.gsub(/\s+/, ' ').strip
          department = data.split[0]
          number = data.split[1]
          name = page.css('b').text.strip
          if name == ""
            name = page.css('p')[0].text.strip
          end
          professors_array = Array.new
          page.css('tr:nth-child(3) a').each do |p|
            professors_array << p.text
          end
          professors = professors_array.join(',')

          hours_array = Array.new
          hours_raw = page.css('td:nth-child(1) tr:nth-child(4)').to_s
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


          page.css('td:nth-child(2) tr').each do |row|
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
            elsif !(row.include? 'Fall 2012')
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
          page.css('table:nth-child(7) p').each do |p|
            description_array << p.text
          end
          description = description_array.join("\n")

        rescue
          log.error "Couldn't process #{course_id}"
          next
        end

        begin
          c = Course.find_or_create_by_oci_id(course_id,
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
            :reading_period => reading_period
          )

          log.info "Saved #{course_id} (#{department} #{number})"
        rescue
          log.error "Couldn't save #{course_id}"
          next
        end
      end
    end
  end
end