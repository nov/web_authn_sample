class Account < ApplicationRecord
  has_many :authenticators

  validate :email, presence: true, uniqueness: true
  validate :display_name, presence: true
end
