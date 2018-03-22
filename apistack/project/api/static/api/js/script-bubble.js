// Variables
var width = 960,
	height = 600,
	legendRectSize = 50,
	legendSpacing = 10,
	names = {},
	keyArr = [],
	countyId = {},
	rateById = {}, // Create empty object for holding dataset
	//colorScale = ['#dadaeb', '#54278f']
	/*color = d3.scaleLinear()
	.domain([0, 6.5])
	.range(colorScale);*/
	color = d3.scaleThreshold()
	//.domain([1, 4, 7, 10, 15, 20, 25, 30, 40])
	.domain([1, 3, 6, 12, 18, 25, 30, 35, 100])
	.range([
		"#bdbdbd",
		"#7f0000",
		"#023858",
		"#4daf4a",
		"#984ea3",
		"#d6db35",
		"#3f007d",
		"#a65628",
		"#000000",
		"#e41a1c"
	]);
	colorYelpRating = d3.scaleThreshold()
	//.domain([1, 4, 7, 10, 15, 20, 25, 30, 40])
	.domain([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
	.range([
		"#bdbdbd",
		"#7f0000",
		"#d6db35",
		"#4daf4a",
		"#984ea3",
		"#023858",
		"#3f007d",
		"#a65628",
		"#000000",
		"#e41a1c"
	]);
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
		//blue
	/*.range([
		"#662506",
		"#023858",
		"#045a8d",
		"#0570b0",
		"#3690c0",
		"#74a9cf",
		"#a6bddb",
		"#d0d1e6",
		"#ece7f2"
	]);*/

var projection = d3.geoAlbers()
    .scale(1050)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
	.attr("height", height);

var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-20, 0])
.html(function(d) {
	//alert(d.states)
	//console.log(rateById);
	var val = "";
	//alert(rateById[d.id]);
	if (rateById[d.id] == undefined || parseInt(rateById[d.id]) < 0){
		val = 'Data not available';
	}else{
		val = rateById[d.id];
	}

	return "<strong>" + countyId[d.id] + " - </strong><span>" + val
});

var radius = d3.scaleSqrt() //bubble
.domain([0, 1e6])
.range([0, 15]);

function getCountyIdNames(tsv){
	tsv.forEach(function(d,i){
		var key = d.name.toString().toUpperCase();
		names[key] = d.id; // county_names: county_geo_id
		countyId[d.id] = key // county_geo_id: county_name
		keyArr.push(key);
	});
}

function prepareData(dataCounty, rateById, us){
	//console.log(dataCounty);
	//console.log(rateById);
	var diff = $(keyArr).not(dataCounty).get();
	diff.forEach(function(d){
		var val = 0;
		rateById[d] = +val;
	});

	// To fill cordinates that are not in cordinates data but are in map data
	var mapArr = [];
	us.objects.counties.geometries.forEach(function(d) {
		mapArr.push(parseInt(d.id));
	});
	var ratebyIdArr = [];
	for (var key in rateById) {
		ratebyIdArr.push(parseInt(key));
	}
	var mapDiff = $(mapArr).not(ratebyIdArr).get();

	mapDiff.forEach(function(d){
		rateById[d] = -1;
	});

	return rateById;
}

function renderData(rateById, us){
	svg.append("g")
		.attr("class", "states")
	  .selectAll("path")
		.data(topojson.feature(us, us.objects.counties).features // Bind TopoJSON data elements
			.sort(function(a, b) { return b.id - a.id; }))
	.enter().append("path")
	.style("fill", function(d) {
		return color(rateById[d.id]); // get rate value for property matching data ID
		// pass rate value to color function, return color based on domain and range
	})
	  	//.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		//.attr("r", function(d) { return radius(rateById[d.id]) * 180; })
		//.attr("r", 2)
		.attr("d", path)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.attr('opacity','0.7');
		//.style("stroke", "black");
}

function transitionData(dataType, rateById, us){
	//console.log(rateById);
	d3.selectAll('#map g.states, .fwhite').transition().remove().duration(1500).delay(500);

	//svg.transition().duration(1500);
	svg.append("g")
		.attr("class", "states")
	  .selectAll("path")
		.data(topojson.feature(us, us.objects.counties).features // Bind TopoJSON data elements
			.sort(function(a, b) { return b.id - a.id; }))
	.enter().append("path")
	.style("fill", function(d) {
		if(dataType=="yelpRating"){
			return colorYelpRating(rateById[d.id]); // get rate value for property matching data ID
		}
		return color(rateById[d.id]); // get rate value for property matching data ID
		// pass rate value to color function, return color based on domain and range
	})
	  	//.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		//.attr("r", function(d) { return radius(rateById[d.id]) * 180; })
		//.attr("r", 2)
		.attr("d", path)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.attr('opacity','0.7');
		//.style("stroke", "black");
}

function meshStates(us) {
	svg.append("path")
	.datum(topojson.mesh(us, us.objects.states, function(a, b) {
		//console.log(a.id, b.id)
		return a.id !== b.id;
	}))
	.attr("class", "fwhite")
	.attr('fill', 'none')
	.attr("stroke","none")
	.attr("d", path);
}

function drawLegendTip(colorMap, legendRectSize, legendSpacing) {
	console.log(colorMap.domain());
	d3.select('#map g.legend').remove();
	var legend = d3.select('svg')
	.append("g")
		.attr('class','legend')
    .selectAll("g")
    .data(colorMap.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize;
        var x = 0;
        var y = i * height;
        return 'translate(' + x + ',' + y + ')';
	});
	
	svg.call(tip);

	legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', colorMap)
    .style('stroke', colorMap);

	legend.append('text')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.text(function(d) { return d; });
}

function appendDropdown() {
	d3.select("#dropdown")
          .selectAll("option")
          .data(dropdown_options)
          .enter()
          .append("option")
          .attr("value", function(option) { return option.value; })
          .text(function(option) { return option.text; });
}

function requestData(dataType, dataset, us) {
	//alert(dataset);
	d3.json(dataset, function(error, data) {
		var dataCounty = [];
		var colorData = "";
		rateById = {};	//reset array that holds dataset
		data.forEach(function(d) {
			//d.county = d.county;
			dataCounty.push(d.county);
			if(dataType == "yelpRating"){
				rateById[names[d.county]] = +d.rating;
			}else if(dataType == "hospAdd"){
				rateById[names[d.county]] = +d.total;
			}

		});
		//console.log(rateById);
		rateById = prepareData(dataCounty, rateById, us);
		transitionData(dataType, rateById, us);
		meshStates(us);
		if(dataType == "yelpRating"){
			colorData = colorYelpRating;
		}else if(dataType == "hospAdd"){
			colorData = color;
		}
		drawLegendTip(colorData, legendRectSize, legendSpacing);
		
	});
}

function onChangeDropdown(us) {
	dataUrl = "";
	var dropDown = d3.select("#dropdown");
	dropDown.on("change", function() {
		selected_dataset = d3.event.target.value;
		if(selected_dataset=="yelpRating"){
			dataUrl = "get/hospital-yelp-rating/";
		}else if(selected_dataset == "hospAdd"){
			dataUrl = "get/hospital-address-count/";
		}
		requestData(selected_dataset, dataUrl, us);
	});
}


queue()
	//.defer(d3.json, jurl)
	.defer(d3.json, jurl)
	.defer(d3.json, durl)
	.defer(d3.tsv, nameValue)
	//.defer(d3.csv, "https://raw.githubusercontent.com/wboykinm/us-state-squares/9bb9d0d820569f978aaebe2d349eae12d56f2b97/example/bpc.csv", function(d) {
	//	data.set(d.state, +d.bpc);
//})
	.await(ready);

// Build map and labels -- State-Bubbles
// Ready Function, runs when data is loaded
function ready(error, us, healthData, tsv) {
	if (error) throw error;

	//d3.tsv(nameValue, function(tsv){
		// extract just the names and Ids
	/*tsv.forEach(function(d,i){
		var key = d.name.toString().toUpperCase();
		names[key] = d.id; // county_names: county_geo_id
		countyId[d.id] = key // county_geo_id: county_name
		keyArr.push(key);
	});*/
	getCountyIdNames(tsv);
	// append dropdown
	appendDropdown();
	onChangeDropdown(us);
	
	var dataCounty = [];
	//var rateById = {}; // Create empty object for holding dataset
	healthData.forEach(function(d) {
		dataCounty.push(d.county);
		rateById[names[d.county]] = +d.total; // Create property for each ID, give it value from rate
	});

	//console.log(Object.keys(rateById).length);
	// Manipulate and prepare Data
	rateById = prepareData(dataCounty, rateById, us);
	//console.log(Object.keys(rateById).length);
	// Draw data on map
	renderData(rateById, us);

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

	// Render Data
	/*svg.append("g")
		.attr("class", "states")
	  .selectAll("path")
		.data(topojson.feature(us, us.objects.counties).features // Bind TopoJSON data elements
			.sort(function(a, b) { return b.id - a.id; }))
	.enter().append("path")
	.style("fill", function(d) {
		return color(rateById[d.id]); // get rate value for property matching data ID
		// pass rate value to color function, return color based on domain and range
	})
	  	//.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		//.attr("r", function(d) { return radius(rateById[d.id]) * 180; })
		//.attr("r", 2)
		.attr("d", path)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.attr('opacity','0.7');
		//.style("stroke", "black");
	*/

	// Mesh States
	meshStates(us);
	/*
	svg.append("path")
	.datum(topojson.mesh(us, us.objects.states, function(a, b) {
		//console.log(a.id, b.id)
		return a.id !== b.id;
	}))
	.attr("class", "fwhite")
	.attr('fill', 'none')
	.attr("stroke","none")
	.attr("d", path);
	*/

	// Labels and Tip
	drawLegendTip(color, legendRectSize, legendSpacing);
	/*
	var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize;
        var x = 0;
        var y = i * height;
        return 'translate(' + x + ',' + y + ')';
	});
	
	svg.call(tip);

	legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

	legend.append('text')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.text(function(d) { return d; });
	*/
	

//});
  }

