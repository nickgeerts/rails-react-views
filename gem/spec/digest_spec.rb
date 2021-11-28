require 'spec_helper'

describe RailsReactViews do
  let(:md5) do
    files = Dir.glob('lib/**/*')
    actual_files = files.reject { |file| File.directory?(file) }
    digests = actual_files.map { |file| Digest::MD5.file(file).to_s }
    Digest::MD5.hexdigest(digests.to_s)
  end

  describe '.files_digest' do
    it 'returns MD5 of files' do
      files = Dir.glob('lib/**/*')
      expect(RailsReactViews.files_digest(files)).to eql md5
    end

    it 'rejects nil' do
      files = [*Dir.glob('lib/**/*'), nil]
      expect(RailsReactViews.files_digest(files)).to eql md5
    end

    it 'returns MD5 of empty array' do
      expect(RailsReactViews.files_digest([])).to eql 'd751713988987e9331980363e24189ce'
    end
  end
end
