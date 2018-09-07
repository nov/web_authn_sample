class Authenticator < ApplicationRecord
  belongs_to :account

  validate :credential_id, presence: true, uniqueness: true
  validate :public_key_pem, presence: true
  validate :sign_count, presence: true, numericality: {only_integer: true, greater_than_or_equal_to: 0}
end
