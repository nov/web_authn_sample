class SessionsController < ApplicationController
  def new
    session[:challenge] = SecureRandom.hex 16
  end
end
