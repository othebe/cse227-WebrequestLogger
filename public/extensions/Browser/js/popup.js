window.addEventListener("DOMContentLoaded", init, false);

var self_id;
var extension_data = null;

function init() {
	//Initialize data
	self_id = chrome.i18n.getMessage("@@extension_id");
	chrome.management.getAll(function(extensions) {
		var elt = document.getElementById('total_extensions');
		elt.innerHTML = extensions.length;
	});
	
	//Load next extension when current one has been logged
	chrome.runtime.onMessage.addListener(function(message, sender) {
		if (message==WEBREQUESTS_LOGGED && enable_ndx<extension_data.length) {
			var ext = extension_data[enable_ndx];
			chrome.management.setEnabled(ext['id'], false, function() {
				enable_ndx++;
				capture_loop();
			});
		}
	});
	
	//Start
	document.getElementById('start').addEventListener('click', function(e) {
		//Begin by disabling all extensions
		disable_extensions();
	});
}

//Store enable state and disable extensions
var disable_ndx = 0;
var disable_complete = false;
function disable_extensions() {
	chrome.management.getAll(function(extensions) {
		if (extension_data == null) extension_data = extensions;
		
		if (disable_ndx >= extension_data.length) {
			add_webrequest_listeners();
			capture_loop();
			return;
		}
		
		var ext = extension_data[disable_ndx];
		var ext_id = ext['id'];
		var ext_name = ext['name'];
		var ext_type = ext['type'];
		var ext_enabled = ext['enabled'];
		
		chrome.management.setEnabled(ext_id, (ext_id==self_id)?true:false, function() {
			disable_ndx++;
			disable_extensions();
		});
	});
}

//Loop through extensions and capture webrequests.
var enable_ndx = 0;
function capture_loop() {
	if (enable_ndx >= extension_data.length) {
		restore_extensions();
		return;
	}
	
	var elt = document.getElementById('current_extension_ndx');
	elt.innerHTML = enable_ndx+1;
	
	var ext = extension_data[enable_ndx];
	if (ext['id']==self_id) {
		enable_ndx++;
		capture_loop();
		return;
	}
	
	//Enable next extension and capture webrequests
	chrome.management.setEnabled(ext['id'], true, function() {
		capture_extension_requests();
	});
}

//Capture webrequests for current extension.
function capture_extension_requests() {
	var ext = extension_data[enable_ndx];
	console.log('Capturing ' + ext['name']);
	message_active_tab(RELOAD);
}

//Restore extension states
function restore_extensions() {
	//Restore enable state
	for (ndx=0; ndx<extension_data.length; ndx++) {
		var elt = extension_data[ndx];
		if (elt['enabled']) chrome.management.setEnabled(elt['id'], true);
	}
}