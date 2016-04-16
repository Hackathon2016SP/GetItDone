function values(o) {
    return Object.keys(o).map(function (k) {
        return o[k];
    })
}

function truncate(x){
  return Math.round(x*100)/100;
}

function sum( obj ) {
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
}

function trim_data(data){
  var value_sum = sum(data);
  data['Others'] = 0.0;
  var keys = Object.keys(data);
  for (var i in keys){
    var key = keys[i];
    if (key != 'Others'){
      var value = data[key];
      if (value/value_sum < 0.01){
        delete data[key];
        data['Others'] = data['Others'] + value;
      }
    }
  }
}


function draw_chart_for_minutes_before(minutes_before) {
    chrome.storage.local.get(null, function (object) {
        var data = {};
        for (var url in object) {
            data[url] = {};
            var data_for_url = JSON.parse(object[url]);
            var visitTimeTotal = 0;
            for (var visitTime in data_for_url) {
                var visitLength = data_for_url[visitTime];
                var date = new Date(parseInt(visitTime));
                var currentDate = new Date();
                if (date > new Date(currentDate.getTime() - minutes_before * 60 * 1000)) {
                    visitTimeTotal = visitTimeTotal + visitLength;
                }
            }
            data[url] = truncate(visitTimeTotal/60);
        }

        function website_percentage(data, elementID) {
            trim_data(data);
            // console.log(document.getElementById(elementID));
            $('#'+elementID).replaceWith('<canvas id="website-chart" width="400" height="400"></canvas>');
            $('.pie-legend').remove();
            var ctx = document.getElementById(elementID).getContext("2d");
            var X = Object.keys(data);
            var Y = values(data);
            var graph_data = [];
            var sites = Object.keys(data);
            for (var i in sites) {
                var site = sites[i];
                graph_data.push({value: data[site], label: site, labelColor: 'white', labelFontSize: '16'});
            }
            var myPieChart = new Chart(ctx).Pie(graph_data, {
                legendTemplate: '<div class=\"margin20\"></div><ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\">&nbsp&nbsp&nbsp&nbsp</span>&nbsp<%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
            });
            document.getElementById(elementID).onclick = function (evt) {
                var activePoints = myPieChart.getSegmentsAtEvent(evt);

                /* this is where we check if event has keys which means is not empty space */
                if (Object.keys(activePoints).length > 0) {
                    var label = activePoints[0]["label"];
                    if(label != 'Others'){
                      var url = "website_over_time_specific.html?" + "span=" + minutes_before + "&website=" + label;
                      location.href=url;
                    }
                }
            };
            var legend = myPieChart.generateLegend();
            $('#' + elementID).parent().append(legend);
        }
            website_percentage(data, "website-chart");
    });
}
var minutes = 10;
draw_chart_for_minutes_before(minutes);
$('#span-select').on('change', function() {
  minutes = parseInt(this.value);
  draw_chart_for_minutes_before(minutes);
});
