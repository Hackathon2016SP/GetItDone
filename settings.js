$('#settings').submit(function(e){
  e.preventDefault();
  

  var data = {};
  var duration = $("#duration").val();
  data["popupTimer"] = duration;
  chrome.storage.local.set(data,function(object){console.log(object)});

  var alarmParam = {}
  alarmParam["delayInMinutes"] = duration/1;
  console.log(alarmParam);
  chrome.alarms.create(alarmParam);


});

