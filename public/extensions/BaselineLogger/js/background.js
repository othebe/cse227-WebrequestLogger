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
chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request==FLUSH) {
		pending_requests = [];
		signal_logging_complete();
	}
	if (request.loaded) {
		while (pending_requests.length > 0) {
			var data = pending_requests.pop();
			data['fullpath'] = request.fullpath;
			send_data(data);
		}
		
		signal_logging_complete();
	}
});

//Signal that logging is complete
function signal_logging_complete() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:3000", true);
	xhr.send();
}

function add_pending(e, type) {
	//Ignore web requests to SERVER_URL
	if (e.url.indexOf(SERVER_URL)==0) return;
	//Ignore web requests to localhost
	if (e.url.toLowerCase().indexOf('localhost')>=0) return;
	
	pending_requests.push({
		'url': e.url,
		'request_type': type,
		'fullpath': ''
	});
}

//Send data via XHR
function send_data(data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", SERVER_URL+'baselines/add', true);
	
	var params = JSON.stringify({data:data});
	
	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/json");
	
	xhr.send(params);
}