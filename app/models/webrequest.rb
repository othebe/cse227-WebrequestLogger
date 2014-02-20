class Webrequest < ActiveRecord::Base
	attr_accessible :extension_id, :extension_name, :response_type, :request_type, :collection, :url
end
