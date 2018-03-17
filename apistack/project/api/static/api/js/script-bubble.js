// Variables
var width = 600,
	height = 400,
	svg = d3.select("#map")
	.append("svg")
	.attr("width", width)
	.attr("height", height),
	//colorScale = ['#e5f5f9', '#2ca25f'],
	colorScale = ['#e5f5f9', '#166072']
	color = d3.scaleLinear()
	.domain([0, 6.5])
	.range(colorScale),
	data = d3.map(),
	projection = d3.geoEquirectangular()
	.center([-96.03542, 41.69553])
	.scale(2000)
	.translate([width / 2, height / 2]),
	path = d3.geoPath()
	.projection(projection),
	tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-20, 0])
	.html(function(d) {
		return "<strong>" + d.properties.abbr + " - </strong><span>" + data.get(d.properties.abbr) + " breweries per capita</span>"
	});

var radius = d3.scaleSqrt() //bubble
.domain([0, 1e6])
.range([0, 15]);

// testing
/*
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
	if (error) return console.error(error);
  	console.log(us)
	svg.append("path")
		.datum(topojson.feature(us, us.objects.nation))
		.attr("class", "land")
		.attr("d", path);
  
	svg.append("path")
		.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
		.attr("class", "border border--state")
		.attr("d", path);
  
	svg.append("g")
		.attr("class", "bubble")
	  .selectAll("circle")
		.data(topojson.feature(us, us.objects.counties).features)
	  .enter().append("circle")
		.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		.attr("r", function(d) { return radius(d.properties.population); });
  });
  */
// testing ends


// Queue
/* 
// Working
queue()
	.defer(d3.json, "https://rawgit.com/geobabbler/us-state-squares/380435e6d7295251519797ecc38d3ee91fb05a01/state_squares.geojson")
	.defer(d3.csv, "https://raw.githubusercontent.com/wboykinm/us-state-squares/9bb9d0d820569f978aaebe2d349eae12d56f2b97/example/bpc.csv", function(d) {
		data.set(d.state, +d.bpc);
})
	.await(ready);
*/
queue()
	//.defer(d3.json, jurl)
	//.defer(d3.json, "https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json")
	.defer(d3.json, "https://rawgit.com/geobabbler/us-state-squares/380435e6d7295251519797ecc38d3ee91fb05a01/state_squares.geojson")
	.defer(d3.csv, "https://raw.githubusercontent.com/wboykinm/us-state-squares/9bb9d0d820569f978aaebe2d349eae12d56f2b97/example/bpc.csv", function(d) {
		data.set(d.state, +d.bpc);
})
	.await(ready);

// Build map and labels -- State-Bubbles

function ready(error, d) {
  svg.append("g")
    .attr("class", "bubble")
    .selectAll("circle")
	.data(d.features)
	.enter()
	//.append("path")
	.append("circle")
	.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
	.attr("r", function(d) { return radius(data.get(d.properties.abbr)) * 400; })
    //.attr("r", 2)
    .attr("class", function(d) {
      return d.properties.abbr;
    })
    .style("fill", function(d) {
      return color(data.get(d.properties.abbr))
    })
    .attr("d", path) // To show only Bubble, hide this
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
	svg.selectAll('.place-label')
	.data(d.features)
	.enter()
	.append('text')
	.attr('class', 'place-label')
	.attr('transform', function(d){
		return 'translate('+ path.centroid(d)+')';
	})
	.attr('dy', '.5em')
	.attr('dx', '-.7em')
	.text(function(d){
		return d.properties.abbr;
	});
	svg.call(tip);
	
	//Label
	var w = 260,
			h = 40,
			key = d3.select('#legend')
			.append('svg')
			.attr('width', w)
			.attr('height', h),
			legend = key.append('defs')
			.append('svg:linearGradient')
			.attr('id', 'gradient')
			.attr('y1', '100%')
			.attr('x1', '0%')
			.attr('y2', '100%')
			.attr('x2', '100%')
	legend.append('stop')
		.attr('offset', '0%')
		.attr('stop-color', colorScale[0])
	legend.append('stop')
		.attr('offset', '100%')
		.attr('stop-color', colorScale[1])
	key.append('rect')
		.attr('width', w - 10)
		.attr('height', h - 20)
		.style('fill', 'url(#gradient)')
		.attr('transform', 'translate(0,0)'),
	y = d3.scaleLinear()
		.range([0, 250])
		.domain([0, 6.5]),
	yAxis = d3.axisBottom()
		.scale(y)
		.ticks(4);
	key.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(10,15)')
		.call(yAxis);
	
	//Animations
	var tl = new TimelineLite(),
			intro = ('#intro'),
			map = ('#map'),
			legend = ('#legend'),
			footer = ('#footer');
	tl
		.from(intro, 1, {
			y: '95%',
			scale: .98,
			ease: Power1.easeInOut,
			autoAlpha: 0})
		.from(map, .75, {
			y: '95%',
			autoAlpha: 0
		}, '+=.5')
		.from(legend, .75, {
			x: 1000,
			autoAlpha: 0
		}, '-=.75')
		.from(footer, .75, {
			y: '95%',
			scale: .9,
			autoAlpha: 0
		});
}