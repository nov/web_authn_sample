class AccountsController < ApplicationController
  before_action :require_authentication, except: :create
  before_action :require_anonymous_access, only: :create

  def show
    session[:challenge] = SecureRandom.hex 16
  end

  def create
    context = WebAuthn.context_for(
      params[:client_data_json],
      origin: request.base_url,
      challenge: session.delete(:challenge)
    )
    if context.registration?
      context.verify! params[:attestation_object]
      account = Account.new(
        email: params[:email]
      ).register_with! context
      authenticate account
      logged_in!
    else
      redirect_to root_url
    end
  end

  def update
    context = WebAuthn.context_for(
      params[:client_data_json],
      origin: request.base_url,
      challenge: session.delete(:challenge)
    )
    if context.registration?
      context.verify! params[:attestation_object], skip_flag_verification: true
      current_account.bind_with! context
    end
    redirect_to root_url
  end
end
