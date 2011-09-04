require 'bundler/setup'

require 'uri'
require 'mongo'
if ENV['MONGOHQ_URL']
  conn = Mongo::Connection.from_uri(ENV['MONGOHQ_URL'])
  DB = conn.db(URI.parse(ENV['MONGOHQ_URL']).path.gsub(/^\//, ''))
else
  DB = Mongo::Connection.new.db('todos')
end

require './todos'

run Todos
