require 'zlib'

module RailsReactViews
  class Prerenderer
    class << self
      def prerender(view: '', path: '', props: {}, context: nil, context_json: nil, cache: true)
        context_json ||= (context || build_context(props: props, view: view, path: path)).to_json

        if cache && Rails.configuration.action_controller.perform_caching
          context_digest = Digest::MD5.hexdigest(context_json)

          Rails.cache.fetch([RailsReactViews::digest, :rails_react_views, :prerenderer, :prerender, context_digest]) do
            process_prerender(context_json)
          end
        else
          process_prerender(context_json)
        end
      end

      def build_context(props: {}, view:, path:)
        {
          view: view,
          path: base_path(path),
          props: props
        }
      end

      def encode_text(text)
        gzipped_text = Zlib::Deflate.deflate(text)
        Base64.strict_encode64(gzipped_text)
      end

      def decode_text(text)
        decoded_text = Base64.strict_decode64(text)
        Zlib::Inflate.inflate(decoded_text).force_encoding('utf-8')
      end

      def split_html(html = '')
        head_start = html.index('<head>')
        head_end = html.index('</head>')
        head = (head_start && head_end ? html[head_start + 6..head_end - 1] : '').html_safe

        body_start = html.index('<body>')
        body_end = html.index('</body>')
        body = (body_start && body_end ? html[body_start + 6..body_end - 1] : '').html_safe

        { head: head, body: body }
      end

      private

      def process_prerender(context_json)
        if server?
          begin
            server_prerender(context_json)
          rescue
            cmd? ? cmd_prerender(context_json) : {}
          end
        elsif cmd?
          cmd_prerender(context_json)
        else
          {}
        end
      end

      def server_prerender(context_json)
        port = RailsReactViews::config[:port]
        response = HTTParty.post("http://localhost:#{port}", body: { context: context_json })

        html = response.success? ? response.body : ''
        split_html(html)
      end

      def cmd_prerender(context_json)
        encoded_context = encode_text(context_json)
        encoded_html = RailsReactViews::Shell.cmd(encoded_context)
        html = decode_text(encoded_html)
        split_html(html)
      end

      def base_path(path)
        if path.end_with?('.json')
          path[0..-6]
        else
          path
        end
      end

      def server?
        RailsReactViews::config[:server]
      end

      def cmd?
        RailsReactViews::config[:cmd]
      end

      def server_up?
        port = RailsReactViews::config[:port]
        response = HTTParty.get("http://localhost:#{port}/ping")
        response.code == 200
      rescue
        false
      end
    end
  end
end
