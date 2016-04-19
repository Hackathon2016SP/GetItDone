# GetItDone
Simple productivity tracker Chrome extension that tracks what websites you're going to and for how long. We also have the option for the user to set how long the want to be productive in a given day and if they go over this point, consequences happen.

### View Local Storage Data
Currently the data is stored within local storage, to view this data, have developer mode on for the Chrome extension, then view background page and print the following code int he console.

```javascript
chrome.storage.local.get(function(result){console.log(result)})
```

Logo from http://cliparts.co/clipart/2716554.
