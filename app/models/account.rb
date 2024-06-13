class Account < ApplicationRecord
  has_many :authenticators, dependent: :destroy

  validates :email, presence: true, uniqueness: true

  def register_with!(authenticator)
    authenticators.new(
      credential_id: authenticator.credential_id,
      public_cose_key_cbor: authenticator.public_cose_key.raw,
      sign_count: authenticator.sign_count
    )
    save!
    self
  end

  def bind_with!(authenticator)
    authenticators.create!(
      credential_id: authenticator.credential_id,
      public_cose_key_cbor: authenticator.public_cose_key.raw,
      sign_count: authenticator.sign_count
    )
    self
  end
end
