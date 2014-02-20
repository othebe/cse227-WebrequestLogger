class WebrequestsController < ApplicationController
	skip_before_filter :verify_authenticity_token  
	
	def add
		data = params[:data]
		
		wr = Webrequest.new(data)
		wr.save
		puts wr.inspect
		
		render :json=>{:success=>true}
	end
end
