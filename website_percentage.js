function values(o) {
    return Object.keys(o).map(function (k) {
        return o[k]
    })
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
            data[url] = visitTimeTotal;
        }

        function website_percentage(data, elementID) {
            // console.log(document.getElementById(elementID));
            $('#'+elementID).replaceWith('<canvas id="website-chart" width="400" height="400"></canvas>')
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
                legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>'
            });
            document.getElementById(elementID).onclick = function (evt) {
                var activePoints = myPieChart.getSegmentsAtEvent(evt);

                /* this is where we check if event has keys which means is not empty space */
                if (Object.keys(activePoints).length > 0) {
                    var label = activePoints[0]["label"];
                    var url = "website_over_time.html?" + "span=" + minutes_before + "&website=" + label;
                }
                chrome.tabs.create({url: url});
            };
            var legend = myPieChart.generateLegend();
            $('#' + elementID).parent().append(legend);
        }
            website_percentage(data, "website-chart");
    });
}
var minutes = 60;
draw_chart_for_minutes_before(minutes);
$('#span-select').on('change', function() {
  minutes = parseInt(this.value);
  draw_chart_for_minutes_before(minutes);
});
