$('#settings').submit(function(e){
  var data = {};
  var duration = $("#duration").val();
  data["popupTimer"] = duration;
  chrome.storage.local.set(data,function(object){console.log(object)});

  var alarmParam = {}
  alarmParam["delayInMinutes"] = duration;
  console.log(alarmParam);
  chrome.alarms.create(alarmParam);

  e.preventDefault();
  
});

