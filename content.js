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
    console.log("poop");
    $(this).text(insert_poop_to_text($(this).text(),0.05));
  });
}
$(document).ready(function () {
  // poop(document);
  sumTime()
});

var blacklist = ["facebook","twitter","tumblr","youtube","messenger"];

function sumTime(){
  chrome.storage.local.get(null, function (object) {
    var totalTime = 10;
    for (var url in object) {
      for (var name in blacklist){
        if (url.includes(name)){

          //kent's code

        }
      }
    }

    chrome.storage.local.get("popupTimer", function(result){
      if (result["popupTimer"] == undefined){
        return;
      } else{
        if (totalTime > result["popupTimer"]){
          console.log("pooop!");
          poop(document);
        }
      }
    })

  });
}