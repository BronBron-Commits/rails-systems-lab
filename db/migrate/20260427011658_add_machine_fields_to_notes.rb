class AddMachineFieldsToNotes < ActiveRecord::Migration[8.1]
  def change
    add_column :notes, :machine_name, :string
    add_column :notes, :machine_location, :string
    add_column :notes, :machine_model, :string
    add_column :notes, :operating_hours, :integer
  end
end
