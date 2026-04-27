class AddLifecycleToNotes < ActiveRecord::Migration[8.1]
  def change
    add_column :notes, :started_at, :datetime
    add_column :notes, :completed_at, :datetime
  end
end
