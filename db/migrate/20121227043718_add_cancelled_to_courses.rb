class AddCancelledToCourses < ActiveRecord::Migration
  def up
    add_column :courses, :cancelled, :boolean
  end

  def down
    remove_column :courses, :cancelled
  end
end
