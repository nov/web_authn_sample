class Authenticator < ApplicationRecord
  belongs_to :account

  validates :credential_id, presence: true, uniqueness: true
  validates :public_key_pem, presence: true
  validates :sign_count, presence: true, numericality: {only_integer: true, greater_than_or_equal_to: 0}
end
