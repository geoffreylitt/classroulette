class AddNoExamAndPermissionRequiredToCourses < ActiveRecord::Migration
  def up
    add_column :courses, :no_exam, :boolean
    add_column :courses, :permission_required, :boolean

    Course.all.each do |c|
      if c.notices.include? 'Permission of instructor required'
        c.permission_required = true
      else
        c.permission_required = false
      end

      if c.notices.include? 'No regular final examination'
        c.no_exam = true
      else
        c.permission_required = false
      end

      c.save!
    end
  end

  def down
    remove_column :courses, :no_exam
    remove_column :courses, :permission_required
  end
end
