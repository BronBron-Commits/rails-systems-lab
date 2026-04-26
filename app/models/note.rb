class Note < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments, dependent: :destroy

  validates :title, presence: true
  validates :body, length: { minimum: 10 }

  before_save :auto_set_status
  before_save :calculate_score

  def completed?
    status == "Done"
  end

  private

  def auto_set_status
    if body&.downcase&.include?("urgent")
      self.status = "Done"
    else
      self.status = "Pending" if status.blank?
    end
  end

  def calculate_score
    total = 0
    total += 30 if body&.downcase&.include?("urgent")
    total += 20 if body.to_s.length > 50
    total += 10 if title&.downcase&.include?("important")

    self.score = total
  end
end
