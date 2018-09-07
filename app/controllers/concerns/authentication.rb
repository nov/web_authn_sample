module Concerns
  module Authentication
    extend ActiveSupport::Concern

    SESSION_LIFETIME = 8.hours

    class AuthenticationRequired < StandardError; end
    class AnonymousAccessRequired < StandardError; end

    included do
      helper_method :current_user, :authenticated?
      rescue_from AuthenticationRequired,  with: :authentication_required!
      rescue_from AnonymousAccessRequired, with: :anonymous_access_required!
    end

    def authentication_required!(e)
      redirect_to session_url
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

    def current_user
      @current_user ||= if session[:authenticated_at].try(:>, SESSION_LIFETIME.ago)
        current_tenant.users.find_by(id: session[:current_user])
      elsif session[:current_user].present?
        unauthenticate!
      end
    end

    def authenticated?
      current_user.present? &&
      current_user.enabled?
    end

    def authenticate(user)
      refresh_session
      session[:current_user] = user.id
      session[:authenticated_at] = Time.now
    end

    def unauthenticate!
      refresh_session
      @current_user = session[:current_user] = session[:authenticated_at] = nil
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
      session.delete(:after_logged_in_endpoint) || root_url
    end

    def construct_after_logged_in_endpoint
      nil # overwrite me
    end
  end
end
