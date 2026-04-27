Rails.application.routes.draw do
  namespace :api do
    resources :notes
    get "insights", to: "insights#index"
  end
end
