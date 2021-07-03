module RailsReactViews
  def self.digest
    if Rails.env.production?
      @@digest ||= calculate_digest
    else
      calculate_digest
    end
  end

  private

  def self.calculate_digest
    js_files = Dir.glob(Rails.root.join('app/javascript/**/*')).reject { |file| File.directory?(file) }
    yarn_digest = Digest::MD5.file(Rails.root.join('yarn.lock'))
    digests = js_files.map { |file| Digest::MD5.file(file).to_s } << yarn_digest

    Digest::MD5.hexdigest(digests.to_s)
  end
end
