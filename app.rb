require 'sinatra'
require 'sinatra/activerecord'
require 'rubygems'
require 'nokogiri'
require 'uri'

configure :development do
  require 'sinatra/reloader'
end


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


require './course'
require './scrape'

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