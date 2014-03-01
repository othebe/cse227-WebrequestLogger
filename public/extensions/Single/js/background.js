//Full origin path
var fullpath = '';

//Pending requests
var pending_requests = [];

//Pre request
chrome.webRequest.onBeforeRequest.addListener(
	function(e) {
		add_pending(e, BEFORE_REQUEST);
	}, { urls:["<all_urls>"] }
);

//Post request
chrome.webRequest.onResponseStarted.addListener(
	function(e) {
		add_pending(e, RESPONSE_STARTED);
	}, { urls:["<all_urls>"] }
);

//Main page loaded
var loaded = false;
chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request==FLUSH) {
		pending_requests = [];
		signal_logging_complete();
	}
	
	if (request.loaded) {
		fullpath = request.fullpath;
		loaded = true;
	}
});

//Deadlocks: No change in DOM LONG
var old_pr = 0;
setInterval(function() {
	if (!loaded) return;
	
	if (pending_requests.length==old_pr && old_pr!=0) {
		while (pending_requests.length > 0) {
			var data = pending_requests.pop();
			data['fullpath'] = fullpath;
			send_data(data);
		}
		
		signal_logging_complete();
	}
	else old_pr = pending_requests.length;
}, 5000);

//Record web requests
function add_pending(data, request_type) {
	var url = data.url;
	var type = data.type;
	var self_id = chrome.i18n.getMessage("@@extension_id");
	
	//Ignore Google web requests
	if (data.url.indexOf("https://www.google.com")==0) return;
	//Ignore web requests to SERVER_URL
	if (data.url.indexOf(SERVER_URL)==0) return;
	//Ignore web requests to localhost
	if (data.url.toLowerCase().indexOf('localhost')>=0) return;
	
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
				
				pending_requests.push(xhr_data);
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
}

function signal_logging_complete() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", SERVER_URL, true);
	xhr.send();
	loaded = false;
}

//Message active tab
function message_active_tab(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg);
	});
}