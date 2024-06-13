class SessionsController < ApplicationController
  before_action :require_anonymous_access, only: [:new, :create]

  def new
    session[:challenge] = SecureRandom.hex 16
  end

  def create
    if params[:authenticator_data].present?
      authenticate_by_passkey
    elsif params[:username].present?
      authenticate Account.find_or_create_by!(email: params[:username])
      logged_in!
    end
    redirect_to root_url
  end

  def destroy
    unauthenticate!
    redirect_to root_url
  end

  private

  def authenticate_by_passkey
    context = WebAuthn.context_for(
      params[:client_data_json],
      origin: request.base_url,
      challenge: session.delete(:challenge)
    )
    if context.authentication?
      authenticator = Authenticator.find_by!(credential_id: params[:credential_id])
      context.verify!(
        params[:authenticator_data],
        public_cose_key: authenticator.public_cose_key,
        sign_count: authenticator.sign_count,
        signature: params[:signature]
      )
      authenticator.update(sign_count: context.sign_count)
      authenticate authenticator.account
      logged_in!
    end
  end
end
