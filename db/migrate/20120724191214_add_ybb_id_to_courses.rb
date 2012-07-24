class AddYbbIdToCourses < ActiveRecord::Migration
  def up
    add_column :courses, :ybb_id, :integer
  end

  def down
    remove_column :courses, :ybb_id
  end
end
