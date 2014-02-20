window.onload = function() {
	chrome.runtime.sendMessage(null, LOADED);
	
	chrome.runtime.onMessage.addListener(function(request, sender) {
		if (request==RELOAD) window.location.reload();
	});
}