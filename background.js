var initialTime = 0;
var visiting = false;
var oldURL = "";
var idle = false;
var stored = false;

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
          // console.log("Undefined Tabs")
          callback(undefined);
        }
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];
        if (tabs[0] == undefined){
          // console.log("Undefined Tab")
          callback(undefined);
          return;
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

// Store the previous tab session (oldURL) and restarts timer and URL
// for the new tab
function storeData() {
    getCurrentTabUrl(function (url) {
        // checks if not first interaction and that the previous url
        // is not undefined (only happens when interacting with console)
        if (visiting && oldURL != undefined) {
    //  if (visiting && !(/chrome.*/.test(oldURL))) {
		//	  console.log(!(/chrome.*/.test(oldURL)))
          var afterDate = new Date();
          var afterTime = afterDate.getTime();
          var difference = (afterTime - initialTime) / 1000;
          console.log(difference);
    			
          // does not count super small amounts of time
          // may be slightly problematic
          if (difference > 1) {
            var afterString = afterTime.toString();
    				var stringified = {};
    				stringified[afterString] = difference;
    				var data = {};
    				data[oldURL] = JSON.stringify(stringified);

            // attemtps to get the old data
    				chrome.storage.local.get(oldURL, function(object) {
              // if no old data or if no old data for to be stored url
              // then it is a new website and should be added as such
    					if(object == undefined || object[oldURL] == undefined) {
                console.log("New website");
                console.log("Stored URL: "+oldURL);
    						chrome.storage.local.set(data, function () {
    							chrome.storage.local.get(oldURL, function (object) {
                    updateTimeAndURL(url);
    							})
    						});
              // otherwise gets the old site's information and 
              // adds a new section of time to the list 
              // data structure is object[site name]{endTime : duration}
    					} else {
    						if (object[oldURL] != undefined) {
                  console.log("Website exists")
    							var found = JSON.parse(object[oldURL]);
    							found[afterString] = difference;
    							var newData = {};
    							newData[oldURL] = JSON.stringify(found);
    							console.log("Stored URL: "+oldURL);
                  chrome.storage.local.set(newData, function () {
  								chrome.storage.local.get(oldURL, function (object) {
                      updateTimeAndURL(url);
    								})
    							});
    						}
    					}
  				  });
          // even if difference is less than 1, still need to update
  			  } else {
            updateTimeAndURL(url);   
          }
      // in the case that oldURL is undefined, then just update the 
      // url and time 
      } else if (oldURL == undefined){
        console.log("undefined url");
        updateTimeAndURL(url);
      }
      // this should only be called the first time, can be merged
      // with the else if case, but for current sake of clarity isnt
      else {
        visiting = true;
        updateTimeAndURL(url);
      }
    });
}

// updates time and url, of which are global variables hence can be 
// put in a separate function
function updateTimeAndURL(url){
  // new date object needs to be generated on creation
  var date = new Date();
  initialTime = date.getTime();
  oldURL = url; 
  // console.log("New URL: "+oldURL);
}


//When switching tabs, will storeData
chrome.tabs.onActivated.addListener(
  function(){
    console.log("on Activated");
    storeData();
});

//When tab finishes loading a page, will storeData
chrome.tabs.onUpdated.addListener(
  function(tabId,changeInfo,tab){
    if (changeInfo["status"] == "complete"){
      storeData();      
      console.log("on page complete");
    }
  });

//When tab is created, will start listening
// chrome.tabs.onCreated.addListener(
//   function(){
//     console.log("on Created");
//     storeData();
// });

// changes when windows change (should handle window changes)
// but chrome api has a bug
chrome.windows.onFocusChanged.addListener(
  function(windowId){
    console.log("on focus changed");
    //if (windowId == chrome.windows.WINDOW_ID_NONE) {
    storeData();
  //}
});

// handles cases when idle/locked
chrome.idle.onStateChanged.addListener(
  function(newState){
    console.log("on state changed");
    // if display is idle, then store the time up to idle point
    if (newState == "idle"){
      storeData();
      idle = true;    
    } else if (newState == "locked"){
      // if you're not locking from an idle state, then 
      // store data, otherwise do nothing
      if (!idle) {
        storeData();
      }
      idle = false;
    } else if (newState == "active") { 
      // if coming from idle, then store data (user reading an article)
      if (idle) {
        storeData();
        idle = false;
      // if coming from locked, then should just update 
      } else {
          // this should update the url and time
          getURLAndUpdate()
      }
    }
  }
);

function getURLAndUpdate(){
  getCurrentTabUrl(function (url) {
    if (visiting) {
      updateTimeAndURL(url);
    }
  });
}

setInterval(function(){ 
  chrome.windows.getCurrent(null, function(currentWindow){
    //console.log(currentWindow["focused"]);
    var focused = currentWindow["focused"];
    // checks if window is not focused and data has not been
    // stored yet. 
    if (!focused){
      if (!stored){
        console.log("on focus");
        storeData();
        stored = true;
      } else{
        getURLAndUpdate();
      }
      console.log("not focused");
    
    // in case where screen is in focus, then hasn't stored yet
    } else {
      stored = false;
      console.log("focused");
    }
  });
}, 5000);


chrome.runtime.onInstalled.addListener(function () {
    console.log("Installed.");
   // chrome.alarms.create({delayInMinutes: 0.1});
});

chrome.alarms.onAlarm.addListener(function () {
    alert("Time's up!");
});
