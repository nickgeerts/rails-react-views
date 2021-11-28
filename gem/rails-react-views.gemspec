# encoding: utf-8

require_relative 'lib/rails_react_views/version'

Gem::Specification.new do |spec|
  spec.name          = 'rails-react-views'
  spec.version       = RailsReactViews::VERSION
  spec.summary       = "React.js views for Ruby on Rails"
  spec.description   = "A library for full integration of React.js views in Ruby on Rails."
  spec.authors       = ["Nick Geerts"]
  spec.files         = Dir['lib/**/*', 'LICENSE', 'README.md']
  spec.homepage      = 'https://rubygems.org/gems/rails-react-views'
  spec.license       = 'MIT'

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/njjkgeerts/rails-react-views"
  spec.metadata["changelog_uri"] = "https://github.com/njjkgeerts/rails-react-views/releases"

  spec.add_dependency "rails", "~> 6.0"
  spec.add_dependency "webpacker", "~> 5.0"
  spec.add_development_dependency "rspec"
end
