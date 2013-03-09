


google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
	      ['Year', 'Sales'],
    	  ['2004',  1463],
    	  ['2005', 35],
    	  ['2006', 110020],
    	  ['2007',  1030]
	]);        
	
    var options = {
        title: 'Expenses chart',
        vAxis: {
	  	    title: "Total cost"
        },
        hAxis: {
	  	    title: "Months from now"
        },
        legend: { position: "none"},
        curveType: "function"
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

var $showOrHide = $('#show_breakdown');
var $breakDown = $('#mortgage_breakdown')

$showOrHide.click( function (event) {
    event.preventDefault();
    if ( /^show/i.test($showOrHide.html()) )
    {
        $breakDown.show();
        $showOrHide.html("Hide mortgage breakdown");
    }
    else
    {
        $breakDown.hide();
        $showOrHide.html("Show mortgage breakdown");
    }
});