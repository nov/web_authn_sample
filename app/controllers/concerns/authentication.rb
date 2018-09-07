module Concerns
  module Authentication
    extend ActiveSupport::Concern

    SESSION_LIFETIME = 8.hours

    class AuthenticationRequired < StandardError; end
    class AnonymousAccessRequired < StandardError; end

    included do
      helper_method :current_account, :authenticated?
      rescue_from AuthenticationRequired,  with: :authentication_required!
      rescue_from AnonymousAccessRequired, with: :anonymous_access_required!
    end

    def authentication_required!(e)
      redirect_to root_url
    end

    def anonymous_access_required!(e)
      redirect_to after_logged_in_endpoint
    end

    def require_authentication
      unless authenticated?
        session[:after_logged_in_endpoint] = case
        when request.get?
          request.url
        else
          construct_after_logged_in_endpoint
        end
        raise AuthenticationRequired
      end
    end

    def require_anonymous_access
      raise AnonymousAccessRequired if authenticated?
    end

    def current_account
      @current_account ||= if session[:authenticated_at].try(:>, SESSION_LIFETIME.ago)
        Account.find_by(id: session[:current_account])
      elsif session[:current_account].present?
        unauthenticate!
      end
    end

    def authenticated?
      current_account.present?
    end

    def authenticate(user)
      refresh_session
      session[:current_account] = user.id
      session[:authenticated_at] = Time.now
    end

    def unauthenticate!
      refresh_session
      @current_account = session[:current_account] = session[:authenticated_at] = nil
    end

    def refresh_session
      previous_session = session.to_hash
      reset_session
      session.update previous_session
    end

    def logged_in!
      redirect_to after_logged_in_endpoint
    end

    def after_logged_in_endpoint
      session.delete(:after_logged_in_endpoint) || account_url
    end

    def construct_after_logged_in_endpoint
      nil # overwrite me
    end
  end
end
