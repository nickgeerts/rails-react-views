module RailsReactViews
  module Concern
    extend ActiveSupport::Concern

    def render_react_view(view: nil, props: {}, prerender: true, cache: true, layout: nil)
      view ||= "#{controller_path}/#{action_name}"
      layout ||= RailsReactViews::config[:layout]
      context = RailsReactViews::Prerenderer.build_context(view: view, props: props, path: request.path)

      respond_to do |format|
        format.html do
          context_json = context.to_json
          response = prerender ? RailsReactViews::Prerenderer.prerender(context_json: context_json, cache: cache) : {}
          @head = response[:head]
          @body = response[:body]
          @body_with_state = "<div id=\"rails-react-view\">#{@body}</div>\n<script>window.__RAILS_REACT_VIEW_CONTEXT__ = #{context_json}</script>".html_safe

          render inline: "<%= content_for :head, @head %><%= @body_with_state %>", layout: layout
        end

        format.json do
          render json: {
            **context,
            '__type': 'RailsReactView'
          }
        end
      end
    end
  end
end
