class Comment < ApplicationRecord
  belongs_to :note
  validates :body, presence: true, length: { minimum: 2 }
end
