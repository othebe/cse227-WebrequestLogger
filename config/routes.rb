WebRequestLogger::Application.routes.draw do
	match '/:controller/:action', via:[:get, :post]
end
