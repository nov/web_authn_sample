class Authenticator < ApplicationRecord
  belongs_to :account

  validates :credential_id, presence: true, uniqueness: true
  validates :public_cose_key_cbor, presence: true
  validates :sign_count, presence: true, numericality: {only_integer: true, greater_than_or_equal_to: 0}

  def public_cose_key
    COSE::Key.decode public_cose_key_cbor
  end
end
