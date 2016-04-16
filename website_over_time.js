function values(o) {
    return Object.keys(o).map(function (k) {
        return o[k]
    })
}

var test_data = {};
chrome.storage.local.get(null, function (object) {
    var dateObject = new Date(0);
    for (var url in object) {
        test_data[url] = {};
        var data_for_url = JSON.parse(object[url]);
        var oldTime = 0;
        var visitTimeForDate = 0;
        for (var visitTime in data_for_url) {
            var visitLength = data_for_url[visitTime];
            var date = new Date(parseInt(visitTime));
            var time = String(date.getUTCHours()) + ":" + String(date.getUTCMinutes());
            // Exceptional case for first old date object
            if (oldTime == 0) {
                oldTime = time;
            }
            if (time == oldTime) {
                visitTimeForDate = visitTimeForDate + visitLength;
            } else {
                test_data[url][oldTime] = visitTimeForDate;
                visitTimeForDate = 0;
            }
            oldTime = time;
        }
    }
    function website_over_month(data, elementID) {
        var ctx = document.getElementById(elementID).getContext("2d");
        var X = Object.keys(data);
        //for (var i in X) {
        //    X[i] = convert_to_label(X[i]);
        //}
        var Y = values(data);
        var data = {
            labels: X,
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: Y
                }
            ]
        };
        options = {};
        var myLineChart = new Chart(ctx).Line(data, options);
    }

    function create_canvas(website) {
        var str = '<div class="chart-div col-md-5"><h1>' + website + '</h1><canvas class="time-chart" id="' + website + '" width="400" height="400"></canvas></div>'
        return str;
    }

    website = "https://www.facebook.com/";
    $('#charts').append(create_canvas(website));
    website_over_month(test_data[website], website);
});
