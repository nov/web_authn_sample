class AccountsController < ApplicationController
  def create
    context = WebAuthn.context_for(
      params[:client_data_json],
      origin: request.base_url,
      challenge: session.delete(:challenge)
    )
    if context.registration?
      account = Account.new(
        email: params[:email],
        display_name: params[:display_name]
      )
      if account.valid?
        context.verify! params[:attestation_object]
        account.authenticators.new(
          credential_id: context.credential_id,
          public_key_pem: context.public_key.to_pem,
          sign_count: context.sign_count
        )
        account.save!
      end
    end
    redirect_to root_url
  end
end
