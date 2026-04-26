class Note < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments, dependent: :destroy

  validates :title, presence: true
  validates :body, length: { minimum: 10 }

  before_save :auto_set_status

  def completed?
    status == "Done"
  end

  private

  def auto_set_status
    if body&.downcase&.include?("urgent")
      self.status = "Done"
    else
      self.status ||= "Pending"
    end
  end
end
