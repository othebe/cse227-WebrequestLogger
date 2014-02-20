//Pending requests
var pending_requests = 0;

//Pre request
chrome.webRequest.onBeforeRequest.addListener(
	function(e) {
		log_requests(e, BEFORE_REQUEST);
	}, { urls:["<all_urls>"] }
);

//Post request
chrome.webRequest.onResponseStarted.addListener(
	function(e) {
		log_requests(e, RESPONSE_STARTED);
	}, { urls:["<all_urls>"] }
);

//Record web requests
function log_requests(data, request_type) {
	var url = data.url;
	var type = data.type;
	var self_id = chrome.i18n.getMessage("@@extension_id");
	
	//Ignore Google web requests
	if (data.url.indexOf("https://www.google.com")==0) return;
	//Ignore web requests to SERVER_URL
	if (data.url.indexOf(SERVER_URL)==0) return;
	//Ignore web requests to localhost
	if (data.url.toLowerCase().indexOf('localhost')>=0) return;
	
	//Increment pending webrequest counter
	if (request_type==BEFORE_REQUEST) pending_requests++;
	
	chrome.management.getAll(function(extensions) {
		for (ndx=0; ndx<extensions.length; ndx++) {
			var ext = extensions[ndx];
			var ext_id = ext['id'];
			
			//Skip self
			if (ext_id==self_id) continue;
			
			if (ext['enabled']) {
				var xhr_data = {
					'extension_id': ext_id,
					'extension_name': ext['name'],
					'url': url,
					'response_type': type,
					'request_type': request_type,
					'collection': COLLECTION
				};
				
				send_data(xhr_data);
				break;
			}
		}
	});
}

//Send data via XHR
function send_data(data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", SERVER_URL+'webrequests/add', true);
	
	var params = JSON.stringify({data:data});
	
	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/json");
	
	xhr.send(params);
	xhr.onreadystatechange = function() {
		//Decrement pending webrequest counter
		if (xhr.readyState==4 && data['request_type']==RESPONSE_STARTED) {
			pending_requests--;
			if (pending_requests==0) message_active_tab(WEBREQUESTS_LOGGED);
		}
	}
}

//Message active tab
function message_active_tab(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg);
	});
}