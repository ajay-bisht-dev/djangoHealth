// Variables
var width = 960,
	height = 600,
	//colorScale = ['#dadaeb', '#54278f']
	/*color = d3.scaleLinear()
	.domain([0, 6.5])
	.range(colorScale);*/
	color = d3.scaleThreshold()
    .domain([1, 4, 7, 10, 15, 20, 25, 30, 40])
	//.range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
	//.range(["#54278f", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb"]);
	/*.range(["#e41a1c",
		"#54278f",
		"#4daf4a",
		"#984ea3",
		"#ff7f00",
		"#ffff33",
		"#a65628",
		"#f781bf",
		"#999999"]);*/
	/*.range([
		"#023858",
		"#045a8d",
		"#0570b0",
		"#3690c0",
		"#74a9cf",
		"#a6bddb",
		"#d0d1e6",
		"#ece7f2",
		"#fff7fb"
	]);*/

var projection = d3.geoAlbers()
    .scale(1050)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
	.attr("height", height);

/*var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-20, 0])
.html(function(d) {
	return "<strong>" + d.properties.abbr + " - </strong><span>" + data.get(d.properties.abbr) + " breweries per capita</span>"
});*/

var radius = d3.scaleSqrt() //bubble
.domain([0, 1e6])
.range([0, 15]);

queue()
	//.defer(d3.json, jurl)
	.defer(d3.json, jurl)
	.defer(d3.json, durl)
	//.defer(d3.csv, "https://raw.githubusercontent.com/wboykinm/us-state-squares/9bb9d0d820569f978aaebe2d349eae12d56f2b97/example/bpc.csv", function(d) {
	//	data.set(d.state, +d.bpc);
//})
	.await(ready);

// Build map and labels -- State-Bubbles
// Ready Function, runs when data is loaded
function ready(error, us, unemployment) {
	if (error) throw error;

	var names = {};
	d3.tsv(nameValue, function(tsv){
		// extract just the names and Ids
		tsv.forEach(function(d,i){
		  var key = d.name.toString().toUpperCase();
		  //names[key] = parseInt(d.id,10);
		  names[key] = d.id;
		});
	
	//console.log(names);
	//console.log(names['SHELBY']);
	
	var rateById = {}; // Create empty object for holding dataset
	unemployment.forEach(function(d) {
		
		rateById[names[d.county]] = +d.total; // Create property for each ID, give it value from rate
	});

	//console.log(rateById)

	/* // Working
	svg.append("g")
		.attr("class", "counties")
	  .selectAll("path")
		.data(topojson.feature(us, us.objects.counties).features) // Bind TopoJSON data elements
	  .enter().append("path")
		.attr("d", path)
		//.style("fill", "white")
		.style("fill", function(d) {
			return color(rateById[d.id]); // get rate value for property matching data ID
			// pass rate value to color function, return color based on domain and range
		});
		//.style("stroke", "black");
	*/

	// test
	svg.append("g")
		.attr("class", "bubble")
	  .selectAll("circle")
		.data(topojson.feature(us, us.objects.counties).features // Bind TopoJSON data elements
			.sort(function(a, b) { return b.id - a.id; }))
	.enter().append("circle")
	  	.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		.attr("r", function(d) { return radius(rateById[d.id]) * 180; })
		//.attr("r", 2)
		.attr("d", path)
		//.style("fill", "white")
		.style("fill", function(d) {
			return color(rateById[d.id]); // get rate value for property matching data ID
			// pass rate value to color function, return color based on domain and range
		})
		.attr('opacity','0.7');
		//.style("stroke", "black");

	svg.append("path")
	.datum(topojson.mesh(us, us.objects.states, function(a, b) {
		//console.log(a.id, b.id)
		return a.id !== b.id;
	}))
	.attr("class", "fwhite")
	.attr('fill', 'none')
	.attr("stroke","white")
	.attr("d", path);

});
  }

