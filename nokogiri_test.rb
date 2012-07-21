require 'rubygems'
require 'nokogiri'   
require 'open-uri'
require 'logger'

def test
  log = Logger.new('log.txt')
  array = [16054, 12054]

  array.each do |course_id|
    begin
      page = Nokogiri::HTML(open("http://students.yale.edu/oci/resultDetail.jsp?course=#{course_id}&term=201203"))
    rescue
      log.debug "Couldn't find id #{course_id}"
      next
    end
    data = page.css('td:nth-child(1) tr:nth-child(1) .RowText').text.gsub(/\s+/, ' ').strip
    department = data.split[0]
    number = data.split[1]
    name = page.css('b').text.strip
    if name == ""
      name = page.css('p')[0].text.strip
    end
    professors = Array.new
    page.css('tr:nth-child(3) a').each do |p|
      professors << p.text
    end

    hours = Array.new
    hours_raw = page.css('td:nth-child(1) tr:nth-child(4)').to_s
    hours_split = hours_raw.split('<br>')
    hours_split.each do |line|
      hours << line.gsub(/<\/?[^>]*>/, "").strip
    end

    has_final = true
    permission_required = false
    meets_during_rp = false
    readings_in_translation = false
    skills = []
    areas = []

    no_exam_text = page.css('td:nth-child(2) tr:nth-child(2) .RowText').text
    if no_exam_text.include? 'No regular final examination'
      has_final = false
    end

    page.css('td:nth-child(2) tr').each do |row|
      row = row.text
      if row.include? 'Permission of instructor required'
        permission_required = true
      elsif row.include? 'Meets during reading period'
        meets_during_rp = true
      elsif row.include? 'Skills'
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
      end
    end

    description = ""
    page.css('table:nth-child(7) p').each do |p|
      description += p.text
      description += "\n"
    end

    puts "Department: #{department}"
    puts "Number: #{number}"
    puts "Name: #{name}"
    puts "Professor: #{professors}"
    puts "Hours: #{hours}"
    puts "Has final: #{has_final}"
    puts "Permission req.: #{permission_required}"
    puts "Meets during RP: #{meets_during_rp}"
    puts "Skills: #{skills}"
    puts "Areas: #{areas}"
    puts "Desc: #{description}"

    log.debug "successfully saved id #{course_id}"

  end
end
