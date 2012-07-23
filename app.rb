require 'sinatra'
require 'sinatra/activerecord'
require 'rubygems'
require 'nokogiri'

configure :development do
  require 'sinatra/reloader'
end

require './course'
require './scrape'

set :database, 'sqlite://development.db'

  ActiveRecord::Base.establish_connection(
    adapter: 'sqlite3',
    database: 'development.db'
)

set :static, true

get '/' do
  erb :index
end

get '/courses' do
  number = [params[:n].to_i, 100].min
  @courses = Course.all.sample(number)
  content_type :json
  @courses.to_json(:methods => :colors)
end