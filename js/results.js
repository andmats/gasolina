
var interest = parseFloat($('#interest').val()) / 100.0 / 12.0;
var rent = parseFloat($('#rent').val());
var savings = parseFloat($('#savings').val());
var price = parseFloat($('#price').val());
var payments = parseFloat($('#payments').val());

//alert (interest + " " + rent + " " + savings + " " + price + " " + payments);

(function main()
{
    //asuming you saving for 100 years...
    if (  payments - (price - savings*100)* interest  <= 0 )
    {
        alert("That property is too hot for you, find something cheaper!");
        return;
    }
    
    if ( payments <= 0 || 1+interest < 1 || price < 0)
    {
        alert("Payments, interest and property price have to be positive, please try again.");
        return ;
    }

    var optN = optimalN();
    
    if ( optN === NaN || optN < 0)
    {
        optN = 0;
    }
    
    showResults(optN);

    drawChart.optN = optN;
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart);

})();


function costAtMonth(m)
{
    if ( savings*m >= price  || interest <= 0)
        return m*rent;
        
    var cost =  m*rent + payments*Math.log(payments/(payments - price * interest + savings * m * interest))
                                / Math.log(1+interest)
            - price + savings*m;
    
    return cost;
}

function optimalN()
{
    if ( rent == 0 )
        return 100*12 // life expectation should be less for most users of this app
        
    if ( savings == 0 || interest == 0 )
        return 0;
    
    return  parseInt(
                (price * interest * (rent + savings) 
                - (rent + savings)*Math.log(1+interest)
                - payments*(rent+savings*interest))
                / (savings*interest*(rent+savings))
             );
}

function pluralOrNot(x, str)
{
    if ( x === 1 )
        return x + " " + str;
    return x + " " + str + "s";
}

function getXAxisRange(optN)
{
    if ( optN < 20*12 )
    {
        return 20*12;
    }

    return optN + 5*12;    
}

function drawChart() 
{
    var data = new google.visualization.DataTable();
    
    data.addColumn('number', 'Month'); // Implicit domain label col.
    data.addColumn('number', 'Cost'); // Implicit series 1 data col.
    data.addColumn({type:'string', role:'annotation'}); // annotation role col.
    data.addColumn({type:'string', role:'annotationText'});
    
    var optN = drawChart.optN;
    var haveAlreadyIncludedOptN = false;
    var upToMonths = getXAxisRange(optN);
    
    for ( var i = 0; i < upToMonths; i+=1)
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

function showResults(optN)
{
    var mort_principal = price-savings*optN > 0 ? price-savings*optN : 0 ;
    var mort_duration =  interest == 0 ? Math.ceil(mort_principal / payments)
                     : Math.ceil(Math.log(payments/(payments-mort_principal*interest))
                                /Math.log(1+interest));

    populateBreakDownTable.mort_principal = mort_principal;
    
    $('.total_wasted').text(costAtMonth(optN).toFixed(2));
    $('.interest_paid').text((payments*mort_duration - mort_principal).toFixed(2));
    $('.mortgage_duration').text( mort_duration );
    $('.mortage_pricipal').text( mort_principal.toFixed(2) );
    $('.rent_duration').text(optN);
    $('.rent_paid').text((rent*optN).toFixed(2));
    $('.total_saved').text((savings*optN).toFixed(2));
}


var $showOrHideUnder = $('#hide_breakdown_under');
var $showOrHide = $('#show_breakdown');
var $breakDown = $('#mortgage_breakdown')

$showOrHideUnder.click( function (event) 
{
    $breakDown.fadeOut();
    $showOrHide.html("Show mortgage breakdown");
    $showOrHideUnder.fadeOut();
});

$showOrHide.click( function (event)
{
    event.preventDefault();
    if ( /^show/i.test($showOrHide.html()) )
    {
        populateBreakDownTable();
        $breakDown.fadeIn();
        $showOrHide.html("Hide mortgage breakdown");
        $showOrHideUnder.fadeIn();
    }
    else
    {
        $breakDown.fadeOut();
        $showOrHide.html("Show mortgage breakdown");
        $showOrHideUnder.fadeOut();
    }
});

function populateBreakDownTable()
{
    $breakDown.find('tbody').html("");

    var stillOwing = populateBreakDownTable.mort_principal;
    var totalInterestPaid = 0;
    var i = 1;
    while (stillOwing > 0 )
    {
        var interestForMonth = interest*stillOwing;
        var principal = payments - interest*stillOwing;
        totalInterestPaid += interestForMonth;
        stillOwing -= principal;
        
        if ( payments - interest*stillOwing <= 0 )
        {
            alert("Oh that property is too hot for you, find something cheaper!");
            return;
        }
        $breakDown.find('tbody').last().append('<tr>'
                    + '<td>' + i + '</td>'
                    + '<td>' + interestForMonth.toFixed(2) + '</td>'
                    + '<td>' + principal.toFixed(2) + '</td>'
                    + '<td>' + totalInterestPaid.toFixed(2) + '</td>'
                    + '<td>' + ( stillOwing < 0 ? 0 :stillOwing.toFixed(2)) + '</td>'
                    +'</tr>'); 
        ++i;
    }
}
