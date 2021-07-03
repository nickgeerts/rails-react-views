module RailsReactViews
  def self.config
    @@config ||= begin
      config =
        if Rails.env.production?
          `NODE_ENV=production node node_modules/rails-react-views/dist/cjs/server/scripts/config.js`
        else
          `BABEL_ENV=test node_modules/.bin/babel-node -x '.js,.jsx,.ts,.tsx' node_modules/rails-react-views/dist/cjs/server/scripts/config.js`
        end

      JSON.parse(config).with_indifferent_access
    end
  end
end
