class AddNoExamAndPermissionRequiredAndMeetsDuringReadingPeriodToCourses < ActiveRecord::Migration
  def up
    add_column :courses, :no_exam, :boolean
    add_column :courses, :permission_required, :boolean
    add_column :courses, :reading_period, :boolean

    Course.all.each do |c|
      if c.notices.include? 'Permission of instructor required'
        c.permission_required = true
      else
        c.permission_required = false
      end

      if c.notices.include? 'No regular final examination'
        c.no_exam = true
      else
        c.no_exam = false
      end

      if c.notices.include? "Meets during reading period"
        c.reading_period = true
      else
        c.reading_period = false
      end

      c.save!
    end
  end

  def down
    remove_column :courses, :no_exam
    remove_column :courses, :permission_required
    remove_column :courses, :reading_period
  end
end
