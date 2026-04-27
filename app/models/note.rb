class Note < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments, dependent: :destroy

  before_save :default_status
  before_save :calculate_score

  private

  def default_status
    self.status = "Open" if status.blank?
  end

  def calculate_score
    total = 0
    total += 30 if body&.downcase&.include?("urgent")
    total += 20 if body.to_s.length > 50
    total += 10 if title&.downcase&.include?("important")

    self.score = total
  end
end
