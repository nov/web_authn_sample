class Account < ApplicationRecord
  has_many :authenticators

  validates :email, presence: true, uniqueness: true
  validates :display_name, presence: true

  class << self
    def register_with!(authenticator)
      account = new(
        email: params[:email],
        display_name: params[:display_name]
      )
      account.authenticators.new(
        credential_id: authenticator.credential_id,
        public_key_pem: authenticator.public_key.to_pem,
        sign_count: authenticator.sign_count
      )
      account.save!
      account
    end
  end
end
