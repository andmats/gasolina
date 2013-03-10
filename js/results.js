
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

function optimalN()
{
    return  parseInt(
                (price * interest * (rent + savings) 
                - (rent + savings)*Math.log(1+interest)
                - payments*(rent+savings*interest))
                / (savings*interest*(rent+savings))
             );
}

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function pluralOrNot(x, str)
{
    if ( x === 1 )
        return x + " " + str;
    return x + " " + str + "s";
}
function drawChart() 
{
    var data = new google.visualization.DataTable();
    
    data.addColumn('number', 'Month'); // Implicit domain label col.
    data.addColumn('number', 'Cost'); // Implicit series 1 data col.
    data.addColumn({type:'string', role:'annotation'}); // annotation role col.
    data.addColumn({type:'string', role:'annotationText'});
    
    var optN = optimalN();
    var haveAlreadyIncludedOptN = false;

    if ( optN === NaN || optN < 0)
    {
        optN = 0;
    }
    
    for ( var i = 0; i < 30*12; i+=1)
    {
        if ( !haveAlreadyIncludedOptN && optN <= i)
        {
            data.addRow([optN/12.0, costAtMonth(optN), "Optimal", 
                        "Optimal time to get the mortgage from now: " + pluralOrNot(Math.floor(optN/12), "year")
                        + " and " + pluralOrNot(optN%12, "month")]);
            haveAlreadyIncludedOptN = true;
            
            if ( i == optN )
            {
                continue;
            }
        }
        var cost = costAtMonth(i);
        if ( cost !== NaN )
        {
            data.addRow([i/12.0, cost, null, null]);
        }   
    }
	
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