class Account < ApplicationRecord
  has_many :authenticators

  validates :email, presence: true, uniqueness: true
  validates :display_name, presence: true
end
