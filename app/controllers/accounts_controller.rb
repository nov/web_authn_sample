class AccountsController < ApplicationController
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
      redirect_to account_url
    else
      redirect_to root_url
    end
  end
end
