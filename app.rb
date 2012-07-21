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
  haml :courses
end

get '/courses' do
  @courses = Course.all.sample(100)
  content_type :json
  @courses.to_json
end