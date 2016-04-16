var initialTime = 0;
var visiting = false;
var oldURL = "";
var date = new Date();

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

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

//When tab is activated, will start listening
chrome.tabs.onActivated.addListener(function(){

  if(visiting){
    var afterTime = date.getTime();
    var difference = (afterTime-initialTime)/1000;
    var afterString = afterTime.toString();
    var data = {
      oldURL : {afterString : difference}
    };
    chrome.storage.local.set(data,function(){console.log("stored!")});
    visiting = false;
  }

  //initial visit of website will start the timer
  initialTime = date.getTime();
  visiting = true;

  getCurrentTabUrl(function(x){
    oldURL = x;
  });  


  console.log(initialTime);
  printStatus();
});


function printStatus() {
  getCurrentTabUrl(function(x){
    console.log(x);
  });  
}

chrome.browserAction.onClicked.addListener(function (tab) {
    // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' red!');
    chrome.tabs.executeScript({
        code: 'var imgURL = chrome.extension.getURL("poop.png"); $("<img/>").attr("src", imgURL); console.log("hello");'
    });
});
