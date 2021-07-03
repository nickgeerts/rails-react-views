# encoding: utf-8

require_relative 'lib/rails_react_views/version'

Gem::Specification.new do |s|
  s.name          = 'rails-react-views'
  s.version       = RailsReactViews::VERSION
  s.summary       = "React.js views for Ruby on Rails"
  s.description   = "A library for full integration of React.js views in Ruby on Rails."
  s.authors       = ["Nick Geerts"]
  s.files         = Dir['lib/**/*', 'LICENSE', 'README.md']
  s.homepage      = 'https://rubygems.org/gems/rails-react-views'
  s.license       = 'MIT'
  s.require_paths = ['lib']

  s.add_dependency "railties", ">= 5"
  s.add_dependency "webpacker", ">= 5"
end
