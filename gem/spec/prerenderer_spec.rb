require 'spec_helper'

module RailsReactViews
  describe Prerenderer do
    describe '.build_context' do
      it 'returns context' do
        result = Prerenderer.build_context(view: 'home/index', path: '/')

        expect(result).to eql({
          view: 'home/index',
          path: '/',
          props: {},
        })
      end
    end

    describe '.encode_text' do
      it 'returns encoded text' do
        result = Prerenderer.encode_text('foobar123')
        expect(result).to eql('eJxLy89PSiwyNDIGABFDAxA=')
      end

      it 'encodes empty string' do
        result = Prerenderer.encode_text('')
        expect(result).to eql('eJwDAAAAAAE=')
      end
    end

    describe '.decode_text' do
      it 'returns decoded text' do
        result = Prerenderer.decode_text('eJxLy89PSiwyNDIGABFDAxA=')
        expect(result).to eql('foobar123')
      end

      it 'decodes empty string' do
        result = Prerenderer.decode_text('eJwDAAAAAAE=')
        expect(result).to eql('')
      end
    end

    describe '.split_html' do
      before do
        allow_any_instance_of(String).to receive(:html_safe) { |text| text }
      end

      it 'returns head and body' do
        result = Prerenderer.split_html('<html><head><title>Title</title></head><body><h1>Hello</h1></body></html>')

        expect(result).to eql({
          head: '<title>Title</title>',
          body: '<h1>Hello</h1>'
        })
      end

      it 'ignores html tags' do
        result = Prerenderer.split_html('<head><title>Title</title></head><body><h1>Hello</h1></body>')

        expect(result).to eql({
          head: '<title>Title</title>',
          body: '<h1>Hello</h1>'
        })
      end

      it 'returns empty head' do
        result = Prerenderer.split_html('<html><body><h1>Hello</h1></body></html>')

        expect(result).to eql({
          head: '',
          body: '<h1>Hello</h1>'
        })
      end

      it 'returns empty body' do
        result = Prerenderer.split_html('<html><head><title>Title</title></head></html>')

        expect(result).to eql({
          head: '<title>Title</title>',
          body: ''
        })
      end

      it 'returns empty head and body' do
        result = Prerenderer.split_html('')

        expect(result).to eql({
          head: '',
          body: ''
        })
      end
    end
  end
end
