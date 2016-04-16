$('#settings').submit(function(e){
  console.log("lolol");
  e.preventDefault();
  var data = {};
  data["popupTimer"] = $("#duration").val();
  console.log(data);
  chrome.storage.local.set(data,function(object){console.log(object)});
});