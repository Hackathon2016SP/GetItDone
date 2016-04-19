var initialTime = 0;
var visiting = false;
var oldURL = "";

function getDomain(url) {
	if (/http.*\/\/.*?\//.test(url)){
		return (/http.*\/\/.*?\//.exec(url)[0]); 
	}
	else {return url}
}

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        if (tabs == undefined){
          console.log("Undefined Tabs")
          callback(undefined);
        }
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];
        if (tabs[0] == undefined){
          console.log("Undefined Tab")
          callback(undefined);
        }

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');
		
	//	console.log (url);
		//Transform url to domain
		var domain = getDomain(url);
		
	//	console.log(domain);
        callback(domain);
    });
}

// Store the current tab session
function storeData() {
	console.log("Starting Store call")
    getCurrentTabUrl(function (url) {
      if (visiting && !(/chrome.*/.test(oldURL))) {
		//	console.log(!(/chrome.*/.test(oldURL)))
        var afterDate = new Date();
        var afterTime = afterDate.getTime();
        var difference = (afterTime - initialTime) / 1000;

  			if (difference > 1) {
  				var afterString = afterTime.toString();
  				var stringified = {};
  				stringified[afterString] = difference;
  				var data = {};
  				data[oldURL] = JSON.stringify(stringified);
  				chrome.storage.local.get(oldURL, function(object) {
  					if(object == undefined || object[oldURL] == undefined) {
              console.log("New website");
  		//				console.log(data);
  						chrome.storage.local.set(data, function () {
  							chrome.storage.local.get(oldURL, function (object) {
  				//				console.log(object);
  								oldURL = url;
  							})
  						});
  					} else {
  						if (object[oldURL] != undefined) {
                console.log("Website exists")
  							var found = JSON.parse(object[oldURL]);
  							found[afterString] = difference;
  							var newData = {};
  							newData[oldURL] = JSON.stringify(found);
  							chrome.storage.local.set(newData, function () {
  								chrome.storage.local.get(oldURL, function (object) {
  									oldURL = url;
  				//					console.log(newData)
  								})
  							});
  						}
  					}
  				});
  			}
      } else if (url == undefined){
        console.log("undefined url");
      }
      else {
            console.log("first call");
            oldURL = url; // Only called first time
      //      console.log(oldURL);
            visiting = true;
      }
      //initial visit of website will start the timer
      var date = new Date();
      initialTime = date.getTime();
    });
}


//When tab is activated, will start listening
chrome.tabs.onActivated.addListener(
  function(){
    console.log("on Activated");
    storeData();
});

//When tab is updated, will start listening
chrome.tabs.onUpdated.addListener(
  function(){
    console.log("on Updated");
    //storeData();
  });

//When tab is created, will start listening
chrome.tabs.onCreated.addListener(
  function(){
    console.log("on Created");
    storeData();
  });

chrome.windows.onFocusChanged.addListener(
  function(id){
    console.log("on focus changed");
    if (id == chrome.windows.WINDOW_ID_NONE) {
      storeData();
  }
});

chrome.idle.onStateChanged.addListener(
  function(state){
    console.log("on state changed");
    if (state == "active"){
      storeData();
    } else { 
      storeData();
    }
  }
  );

function printStatus() {
    getCurrentTabUrl(function (x) {
  //      console.log(x);
    });
}

chrome.runtime.onInstalled.addListener(function () {
    console.log("Installed.");
   // chrome.alarms.create({delayInMinutes: 0.1});
});

chrome.alarms.onAlarm.addListener(function () {
    alert("Time's up!");
});
