require 'sinatra'

class Todos < Sinatra::Base
  enable :static
  set :public, 'public'
end
