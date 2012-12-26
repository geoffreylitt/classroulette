class AddSemesterToCourses < ActiveRecord::Migration
  def up
    add_column :courses, :semester, :string
  end

  def down
    remove_columnk :courses, :semester
  end
end
