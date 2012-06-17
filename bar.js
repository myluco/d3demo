// datum_to_x is a function that takes a single data item (a datum) and returns its x value.
// datum_to_y is a function that takes a single data item (a datum) and returns its y value.
function bar_chart(dom_id,data,datum_to_x,datum_to_y) {

    // TODO: make these depend on the client's browser window dimensions.
    var bar_chart_height = 200;
    var bar_chart_width = 550;
    
    var max_value = d3.max(data, function(datum) { return datum_to_y(datum)+0;});
    var vertical_scaling = bar_chart_height / max_value;
    var bar_width = bar_chart_width / (data.length * 1.05);
    var max_height = vertical_scaling * max_value;
    
    var chart = d3.select(dom_id).append("svg")
	.attr("class", "chart")
	.attr("width", bar_width * data.length)
	.attr("height", max_height);
    
    var x = function(datum, i) { return i * bar_width; }
    var y = function(datum) { return max_height - (vertical_scaling * datum_to_y(datum))};
    
    // 1. show bar for each datum.
    chart.selectAll("rect")
	.data(data)
	.enter().append("rect")
	.attr("x", x)
	.attr("y", y)
	.attr("height", function(datum) { return datum_to_y(datum) * vertical_scaling; })
	.attr("width", bar_width);
    
    // 2. label each bar with the x value for each datum.
    chart.selectAll("text")
	.data(data)
	.enter().append("text")
	.attr("x", function(datum, i) { return ((i) * (bar_width)); })
	.attr("y", function(datum) { return  max_height - 10;})
	.attr("dx", 50)
	.attr("dy", ".35em") // vertical-align: middle
	.attr("text-anchor", "right")
	.text(function(datum){ return datum_to_x(datum);});
    
    // 3. ticks.
    var tickgen = d3.scale.linear()
	.domain([0,max_value])
    
    var tick_ys = tickgen.ticks(10)
    chart.selectAll("line")
	.data(tick_ys).enter()
	.append("line")
	.attr("x1",function(tick) { return 0;})
	.attr("x2",function(tick) { return bar_width * data.length;})
	.attr("y1",function(tick) { return tick * vertical_scaling;})
	.attr("y2",function(tick) { return tick * vertical_scaling;})
	.style("stroke","#aaa");
    
    // TODO: figure out multiplier for this rather than hardwired.
    var magical_tick_label_number = 12;
    
    // TODO: multiplier of maximum length of number string:
    // e.g. "10000" has length 5.
    var magical_x_label_offset = -15;
    
    // 4. tick labels.
    chart.selectAll(".rule")
	.data(tick_ys)
	.enter().append("text")
	.attr("class", "rule")
	.attr("x", bar_width * data.length)
	.attr("dx", magical_x_label_offset)
	.attr("y", function(tick) {return bar_chart_height - (tick * vertical_scaling);})
	.attr("dy", magical_tick_label_number)
	.attr("text-anchor", "middle")
	.text(String);
    
    // 5. bottom line
    chart.append("line")
	.attr("x1", 0)
	.attr("x2", bar_width * data.length)
	.attr("y1", max_height)
	.attr("y2", max_height)
	.style("stroke", "black");
}

