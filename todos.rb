require 'sinatra'
require 'json'
require 'rack/contrib'

class Todos < Sinatra::Base
  enable :static
  set :public, 'public'
  use Rack::PostBodyContentTypeParser

  def todos
    @todos ||= DB.collection('todos')
  end

  def todo_as_json(todo)
    {
      :id     => todo['_id'].to_s,
      :title  => todo['title'],
      :isDone => todo['isDone']
    }
  end

  get '/' do
    redirect to('/index.html')
  end

  get '/todos' do
    content_type :json
    todos.find.map { |todo| todo_as_json(todo) }.to_json
  end

  post '/todos' do
    id = todos.insert(
      :title     => params[:title],
      :isDone    => params[:isDone] == 'true',
      :updatedAt => Time.now
    )

    todo = todos.find_one(id)
    content_type :json
    todo_as_json(todo).to_json
  end

  delete '/todos/:id' do
    todos.remove({:_id => BSON::ObjectId(params[:id])})
    200
  end
end
