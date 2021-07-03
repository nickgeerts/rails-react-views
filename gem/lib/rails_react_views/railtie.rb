module RailsReactViews
  class Railtie < Rails::Railtie
    initializer "railtie.initializer" do
      RailsReactViews.config
      RailsReactViews.digest

      ActiveSupport.on_load(:action_controller) do
        include RailsReactViews::Concern
      end
    end
  end
end
