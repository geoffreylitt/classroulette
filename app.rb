require 'sinatra'
require 'sinatra/activerecord'
require 'rubygems'
require 'nokogiri'
require 'uri'

configure :development do
  require 'sinatra/reloader'
end

env = ENV["RACK_ENV"] || 'development'

if env == 'development'
  set :database, 'sqlite://development.db'
  ActiveRecord::Base.establish_connection(
    adapter: 'sqlite3',
    database: 'development.db'
  )
else
  db = URI.parse(ENV['DATABASE_URL'])

  ActiveRecord::Base.establish_connection(
    :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
    :host     => db.host,
    :port     => db.port,
    :username => db.user,
    :password => db.password,
    :database => db.path[1..-1],
    :encoding => 'utf8'
  )
end

require './course'
require './scrape'

set :course_array, Course.where("number < 400 AND department != 'DRAM' AND cancelled = 'f'") #crude in-memory cache
set :static, true

get '/' do
  erb :index
end

get '/random' do
  number = [params[:n].to_i, 100].min
  @courses = settings.course_array.sample(number)
  content_type :json
  headers 'Cache-Control' => 'max-age=0, must-revalidate'
  @courses.to_json
end