
var interest = parseFloat($('#interest').val()) / 100.0 / 12.0;
var rent = parseFloat($('#rent').val());
var savings = parseFloat($('#savings').val());
var price = parseFloat($('#price').val());
var payments = parseFloat($('#payments').val());

//alert (interest + " " + rent + " " + savings + " " + price + " " + payments);
function costAtMonth(m)
{
    if ( payments - price * interest + savings * m * interest <= 0 )
    {
        return NaN;
    }
    if ( payments < 0 || 1+interest < 0 )
        return NaN;
        
    return m*rent + payments*Math.log(payments/(payments - price * interest + savings * m * interest))
                            /Math.log(1+interest)
           - price + savings*m;
}

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() 
{
    graph = [['Month', 'Cost']];
    
    for ( var i = 0; i < 30*12; i+=1)
    {
        var cost = costAtMonth(i);
        if ( cost !== NaN )
        {
            graph.push([i/12.0, cost]);
        }   
    }
     
    var data = google.visualization.arrayToDataTable(graph);        
	
    var options = {
        title: 'Expenses chart',
        vAxis: {
	  	    title: "Total cost (rent + interest)"
        },
        hAxis: {
	  	    title: "Years from now"
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