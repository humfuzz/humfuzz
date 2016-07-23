google.charts.load('current', {'packages':['geochart']});
google.charts.setOnLoadCallback(drawRegionsMap);
window.addEventListener('resize', resize_div, false);

function resize_div() {
	//document.getElementById('map').style.width = "100%";	
	//document.getElementById('map').style.height = "100%";
	//console.log("resize");
	drawRegionsMap();
}


function drawRegionsMap() {

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Country'); // Implicit domain label col.
  data.addColumn('number', 'Value'); // Implicit series 1 data col.
  data.addColumn({type:'string', role:'tooltip'}); // 

  data.addRows([

      ["China",null,"basically all the time ><"],

      ["Hong Kong",null,"basically all the time ><"],

      ["Australia",2007,"grade 4 trip"],

      ["United States",2011,"middle school choir"],

      ["Canada",2011.5,"middle school choir"],

      ["Malaysia",2014,"SAT exam & play"],

      ["Singapore",2014.5,"SAT exam & play"],

      ["Japan",2015,"high school grad trip"],

  ]);

	//console.log(data.getTableProperties());
  var formatter = new google.visualization.DateFormat({pattern: "MMM, yyyy"});
  formatter.format(data, 1);

  var options = {
    colorAxis: {colors: ['#3E885B', '#2CA58D', '#6A47E8']},
    defaultColor: '#FFA8BD',
    legend: {numberFormat:'####'},
    height: 0.95 * window.innerHeight

    //legend: 'none' //{textStyle: {color: 'blue', fontSize: 16}}
  	//sizeAxis: {minValue: new Date(2006,7,16),  maxValue: new Date(2009,11,28)}
  };

  var chart = new google.visualization.GeoChart(document.getElementById('map'));

  chart.draw(data, options);
}