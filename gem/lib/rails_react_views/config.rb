module RailsReactViews
  def self.config
    @@config ||= begin
      config = RailsReactViews::Shell.config
      JSON.parse(config).with_indifferent_access
    end
  end
end
