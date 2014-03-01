window.onload = function() {
	chrome.runtime.sendMessage(null, {loaded:true, fullpath:window.location.origin + window.location.pathname});
}

//Deadlocks: No change in DOM
setTimeout(function() {
	chrome.runtime.sendMessage(null, FLUSH);
}, 15000);

//Signal that logging is complete
function signal_logging_complete() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:3000", true);
	xhr.send();
}