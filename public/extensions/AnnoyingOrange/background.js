chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		return {redirectUrl: 'http://static2.wikia.nocookie.net/__cb20120530223732/annoyingorange/images/2/25/EvilOrangeAnnoyingOrange.jpg'};
	}, 
	{ urls: ["<all_urls>"], types: ["image"] }, 
	["blocking"]
);
