module RailsReactViews
  class Shell
    class << self
      def cmd(encoded_context)
        `#{node} node_modules/rails-react-views/dist/cjs/server/scripts/cmd.js #{encoded_context}`
      end

      def config
        `#{node} node_modules/rails-react-views/dist/cjs/server/scripts/config.js`
      end

      private

      def node
        if Rails.env.production?
          'NODE_ENV=production node'
        else
          # Using BABEL_ENV=test to target CommonJS syntax
          "BABEL_ENV=test node_modules/.bin/babel-node -x '.js,.jsx,.ts,.tsx'"
        end
      end
    end
  end
end
