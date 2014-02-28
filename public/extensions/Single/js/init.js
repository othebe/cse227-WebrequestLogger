window.onload = function() {
	chrome.runtime.sendMessage(null, LOADED);

	chrome.runtime.onMessage.addListener(function(request, sender) {
		if (request==WEBREQUESTS_LOGGED) signal_logging_complete();
	});
}

//Signal that logging is complete
function signal_logging_complete() {
	var xhr = new XMLHttpRequest();
	console.log(123);
	xhr.open("GET", SERVER_URL, true);
	xhr.send();
}