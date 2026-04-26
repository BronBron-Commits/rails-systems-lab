class AddScoreToNotes < ActiveRecord::Migration[8.1]
  def change
    add_column :notes, :score, :integer
  end
end
