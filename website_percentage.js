var test_data = {
  "day":{
      "Youtube": 100,
      "Facebook": 90,
      "Twitter": 80,
      "Instagram": 55
    },
    "week":{
      "Youtube": 100,
      "Facebook": 90,
      "Twitter": 80,
      "Instagram": 55
    },
    "month":{
      "Youtube": 100,
      "Facebook": 90,
      "Twitter": 80,
      "Instagram": 55
    }
}

function values(o) { return Object.keys(o).map(function(k){return o[k]}) }

function website_percentage(data, elementID){
  // console.log(document.getElementById(elementID));
  var ctx = document.getElementById(elementID).getContext("2d");
  var X = Object.keys(data);
  var Y = values(data);
  var graph_data= [];
  var sites = Object.keys(data);
  for (var i in sites){
    var site = sites[i];
    graph_data.push({value:data[site], label:site,  labelColor : 'white', labelFontSize : '16'});
  }
  var myPieChart = new Chart(ctx).Pie(graph_data, {
     legendTemplate : '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>'
  });
  document.getElementById(elementID).onclick = function(evt){
      var activePoints = myPieChart.getSegmentsAtEvent(evt);

      /* this is where we check if event has keys which means is not empty space */
      if(Object.keys(activePoints).length > 0)
      {
          var label = activePoints[0]["label"];
          var url = "website_over_time.html?" + "span="+elementID+"&website="+label;
      }
      chrome.tabs.create({ url: url });
  };
  var legend = myPieChart.generateLegend();
  $('#'+elementID).parent().append(legend);
}


var charts = $('.website-chart');
for (var i in charts){
  if(i<charts.length-1){
    var chart = charts[i];
    website_percentage(test_data[chart.id], chart.id);
  }
}
