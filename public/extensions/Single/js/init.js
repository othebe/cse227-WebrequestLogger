window.onload = function() {
	chrome.runtime.sendMessage(null, {loaded:true, fullpath:window.location.origin + window.location.pathname});

	chrome.runtime.onMessage.addListener(function(request, sender) {
		if (request==WEBREQUESTS_LOGGED) signal_logging_complete();
	});
}

//Deadlocks: No change in DOM
setTimeout(function() {
	chrome.runtime.sendMessage(null, FLUSH);
}, 20000);

//Signal that logging is complete
function signal_logging_complete() {
	var xhr = new XMLHttpRequest();
	console.log(123);
	xhr.open("GET", SERVER_URL, true);
	xhr.send();
}