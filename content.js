$(document).ready(function () {
    var imgURL = chrome.extension.getURL("poop.png");
    $("img").attr("src", imgURL);
});
