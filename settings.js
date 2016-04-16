$('#settings').submit(function(e){
  e.preventDefault();
  

  var data = {};
  var duration = $("#duration").val();
  data["popupTimer"] = duration/1; //used to make duration an integer
  chrome.storage.local.set(data,function(){console.log("stored")});

  // Generates alarm
  //var alarmParam = {}
  //alarmParam["delayInMinutes"] = duration/1;
  //console.log(alarmParam);
  //chrome.alarms.create(alarmParam);


});

