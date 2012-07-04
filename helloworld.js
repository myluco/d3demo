// I declared these external so that I can refer to them from the Web Console for Firefox
// (or equivalent with other browsers).

var animals = [
    {"name":"bear",
     "age":10,
     "x":25
    },
    {"name":"otter",
     "age":15,
     "x":85
    },
    {"name":"cat",
     "age":20,
     "x":150
    },
    {"name":"dog",
     "age":25,
     "x":210
    },
    {"name":"wolf",
     "age":30,
     "x":270
    }
];

function hello_world(dom_id) {


    // bear and cat.
    var friends = [ animals[0], animals[1] ,animals[2] ];
    
    // dog and cat.
    var family =  [ animals[2], animals[3] ];

    // dog and wolf
    var canine = [ animals[3], animals[4] ];

    // bear and otter and wolf.
    var wild =  [ animals[0], animals[1] , animals[4] ];

    var svg = d3.select("#simple_svg").append("svg")
	.attr("class", "chart")
	.attr("width", 500)
	.attr("height", 100);

    cycle_through_animals([make_set(friends),
			   make_set(family),
			   make_set(friends),
			   make_set(family),
			   make_set(friends),
			   make_set(family),
			   make_set(friends)
			  ],
			   svg);

}

var current_animal_id = 0;

function make_set(set) {
    return set.map(function(x) {
	return {"name": x.name,
		"x": x.x,
		"animal_id": current_animal_id++
	       };
    });
}

function cycle_through_animals(animal_sets,svg) {
    if (animal_sets.length > 0) {
	// index_fn: what key to use to compare items for equality.
	var index_fn = function(d) {return d.animal_id;};
	
	// text_fn: what to display in the output SVG circle.
	var text_fn = function(d) {return d.name;};
	
	// show the next set in animal_sets.
	var animal_set = animal_sets.shift();

	console.log("switching to set:" + animal_set.map(text_fn));

	d3.select("#status").html("SET IS: " + animal_set.map(text_fn));

	update_svg(svg,animal_set,index_fn,text_fn);
	
	setInterval(function() {
	    cycle_through_animals(animal_sets,svg);
	}, 2000);
    } else {
	console.log("DONE.");
	return false;
    }
}

function complement(all_animals,subset) {
    return all_animals;
}

function update_svg(svg, newdata_array, index_fn,
		    text_fn) {
    var set_complement = complement(animals,newdata_array);

    var newdata = svg.selectAll("circle").data(newdata_array,index_fn);

    // Add items unique to input_data.
    newdata.enter().append("circle").
	attr("cx",function(c) {
	    console.log("appending: " + c.name + "/" + c.animal_id);
	    return c.x;
	}).
	attr("cy",function(c) {return -100;}).
        attr("r", function(c) {return 25;}).
	transition().
	duration(500).
	attr("cy",65);
    
    var newlabels = svg.selectAll("text").data(newdata_array,index_fn);
    newlabels.enter().append("text").
	attr("x",function(c) {
	    return c.x - 10;}).
	attr("y",function(c) {return -100;}).
        attr("r", function(c) {return 25;}).
	text(text_fn).
	transition().
	duration(500).
	attr("y",68);

    // Remove items not in new data.
    newdata.exit().transition().duration(500)
	.attr("cy",
	      function(x) {
		  console.log("removing:" + x.name);
		  return 500;
	      }).remove();

    // Remove labels not in new data.
    newlabels.exit().transition().duration(500).attr("y",500).remove();
}
