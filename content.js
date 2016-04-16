function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function replace_with_poop(imgURL){
  $("img").attr("src", imgURL);
}

function insert_poop_to_text(text, density){
  var poop_num = Math.floor(text.length * density);
  var i=0;
  while(i< poop_num){
    i++;
    var index = getRandomInt(0, text.length);
    text = text.substring(0, index) + "POOP" + text.substring(index)
  }
  return text;
}
function poop(document){
  document.title = 'POOP';
  var imgURL = chrome.extension.getURL("poop.png");
  setInterval(function(){replace_with_poop(imgURL)}, 2000);
  $("p, ls, span, h1, h2, h3, h4").each(function( index ) {
    //console.log("poop");
    $(this).text(insert_poop_to_text($(this).text(),0.05));
  });
  var audioURL = chrome.extension.getURL("hello.wav");
  var audio = new Audio(audioURL);
  audio.play();
}
$(document).ready(function () {
  // poop(document);
  sumTime()
});

var blacklist = ["facebook","twitter","tumblr","youtube","messenger","reddit"];

function sumTime(){
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

    chrome.storage.local.get("popupTimer", function(result){
      //console.log(result);
      if (result["popupTimer"] == undefined){
        return;
      } else{
        if (totalTime > result["popupTimer"] * 60){
        //  console.log("pooop!");
          poop(document);
        }
      }
    })

  });
}
