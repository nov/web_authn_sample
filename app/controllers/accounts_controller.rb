class AccountsController < ApplicationController
  before_action :require_authentication, only: :show
  before_action :require_anonymous_access, only: :create

  def show
  end

  def create
    context = WebAuthn.context_for(
      params[:client_data_json],
      origin: request.base_url,
      challenge: session.delete(:challenge)
    )
    if context.registration?
      context.verify! params[:attestation_object]
      account = Account.register_with! context
      authenticate account
      logged_in!
    else
      redirect_to root_url
    end
  end
end
