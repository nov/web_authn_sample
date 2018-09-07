class SessionsController < ApplicationController
  def new
    session[:challenge] = SecureRandom.hex 16
  end

  def create
    context = WebAuthn.context_for(
      params[:client_data_json],
      origin: request.base_url,
      challenge: session.delete(:challenge)
    )
    if context.authentication?
      authenticator = Authenticator.find_by!(credential_id: params[:credential_id])
      context.verify!(
        params[:authenticator_data],
        public_key: authenticator.public_key,
        sign_count: authenticator.sign_count,
        signature: params[:signature]
      )
      authenticator.update(sign_count: context.sign_count)
      authenticate authenticator.account
      redirect_to account_url
    else
      redirect_to root_url
    end
  end
end
