Rails.application.routes.draw do
  resources :users

  resources :notes do
    resources :comments, only: [:create, :destroy]
  end

  get "/completed", to: "notes#completed"

  namespace :api do
    resources :notes, only: [:index, :show, :create, :destroy]
  end
end
