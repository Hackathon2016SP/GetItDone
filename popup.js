$('#settings').submit(function(e){
  e.preventDefault();
  
  console.log(duration)
  var data = {};
  var duration = $("#duration").val();
  data["popupTimer"] = duration/1; //used to make duration an integer
  chrome.storage.local.set(data,function(){console.log("stored")});

  // Generates alarm
  //var alarmParam = {}
  //alarmParam["delayInMinutes"] = duration/1;
  //console.log(alarmParam);
  //chrome.alarms.create(alarmParam);

  timeRemaining();
  $('#editTime').toggle();

  $('#timeRemain').toggle();
  $('#editButton').toggle();
});

var blacklist = ["facebook","twitter","tumblr","youtube","messenger","reddit"];

function timeRemaining(){
   chrome.storage.local.get(null, function (object) {
      var totalTime = 0;
      var data = {};
      for (var url in object) {
        for (var i in blacklist){
          if (url.includes(blacklist[i])){
            // console.log(blacklist[i]);
            // console.log(object);
            // console.log(url);
            // console.log(object[url]);
            var data_for_url = JSON.parse(object[url]);
            var visitTimeTotal = 0;
            for (var visitTime in data_for_url) {
                var visitLength = data_for_url[visitTime];
                var date = new Date(parseInt(visitTime));
                var currentDate = new Date();
                if (date > new Date(currentDate.getTime() - 1440 * 60 * 1000)) {
                    visitTimeTotal = visitTimeTotal + visitLength;
                }
            }
            totalTime+=visitTimeTotal;
          //  console.log(totalTime);
          }
        }
      }

      chrome.storage.local.get("popupTimer",function(result){
        var time = (result["popupTimer"]*60)-totalTime
        $('#remaining').text("Time Left: "+Math.round(time)+" seconds (~"+Math.round(time/60)+" mins)")    
      });

    });
}

$('#editButton').click(function(){
  $('#editTime').toggle();
  $('#timeRemain').toggle();
  $('#editButton').toggle();
});


$(document).ready(function(){
  timeRemaining();  
});
