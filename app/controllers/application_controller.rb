class ApplicationController < ActionController::Base
  include Concerns::Authentication

  rescue_from ActiveRecord::RecordNotFound do |e|
    redirect_to root_url, alert: 'record not found'
  end
end
