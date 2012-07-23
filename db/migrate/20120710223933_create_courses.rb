class CreateCourses < ActiveRecord::Migration
  def up
    create_table :courses do |t|
      t.integer :oci_id
      t.string :department
      t.integer :number
      t.string :name
      t.string :professors
      t.string :hours
      t.string :notices
      t.string :skills
      t.string :areas
      t.text :desc
      t.boolean :permission_required
      t.boolean :no_exam
      t.boolean :reading_period

      t.timestamps
    end
  end

  def down
    drop_table :courses
  end
end