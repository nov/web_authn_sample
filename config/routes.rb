Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resource :account, only: [:show, :create, :destroy]
  resource :session, only: [:create, :destroy]
  root to: 'sessions#new'
end
