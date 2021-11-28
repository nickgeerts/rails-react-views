module RailsReactViews
  def self.digest
    if Rails.env.production?
      @@digest ||= calculate_digest
    else
      calculate_digest
    end
  end

  def self.files_digest(files)
    actual_files = files.compact.reject { |file| File.directory?(file) }
    digests = actual_files.map { |file| Digest::MD5.file(file).to_s }
    Digest::MD5.hexdigest(digests.to_s)
  end

  private

  def self.calculate_digest
    js_files = Dir.glob(Rails.root.join('app/javascript/**/*'))
    files_digest([*js_files, yarn_file])
  end

  def self.yarn_file
    path = Rails.root.join('yarn.lock')
    File.exists?(path) ? path : nil
  end
end
