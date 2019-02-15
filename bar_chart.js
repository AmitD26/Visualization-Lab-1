 function drawBarChart(data, noOfBins) {
    var binSize = (d3.max(data) - d3.min(data))/noOfBins;
    console.log(binSize);

    var binValArray = Array.apply(null, Array(noOfBins)).map(Number.prototype.valueOf,0);
    data.forEach(function (d) {
        binValArray[Math.floor((d - d3.min(data))/binSize)]++;
    });
    console.log(binValArray);

    var min = d3.min(data);
    var binValues = [];
    for(var i = 0; i < noOfBins; i++){
        var end = (+min + +binSize).toFixed(1);
        binValues.push(min + "-" + end);
        min = end;
    }

    console.log(binValues);

    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    svg.append("text")
        .attr("transform", "translate(300,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("FIFA 19 data");

    var x = d3.scaleBand().range([0, width]).padding(0.4);
    var y = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    x.domain(binValues);
    y.domain([0, d3.max(binValArray)]);


     g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Bins");

    g.append("g")
        .call(d3.axisLeft(y).tickFormat(function(d){
            return  d;
        }).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Counts");

    g.selectAll(".bar")
        .data(binValues)
        .enter().append("rect")
        .attr("class", "bar") //mouseover event is raised when the mouse cursor is moved over an element
        .on("mouseover", onMouseOver) //On selection of bar elements, two new event handlers added, viz. mouseover and mouseout and we are calling the respective functions to handle mouse events
        .on("mouseout", onMouseOut)   //done to apply animation when mouse hovers over a particular bar and goes out
        .on("click", onClick)
        .attr("x", function(d) { return x(d); })
        .attr("y", function(d, i) { return y(binValArray[i]); })
        .attr("width", x.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .delay(function (d, i) {
            return i * 50;
        })
        .attr("height", function(d, i) { return height - y(binValArray[i]); });


        //mouseover event handler function
        /*most callback functions in d3, `this` refers to
        the current node. For example, if you pass a function to `attr`,
        `style`, or `each`, when that function is called, `this` will refer to
        the current DOM element.*/
    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight'); // this, is the object that "owns" the JavaScript code
        //selected bar (given by the 'this' object) d3.select(this) creates a 1-element selection containing the current node
        d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', x.bandwidth() + 5)
            .attr("y", function() { return y(binValArray[i]) - 10; })
            .attr("height", function() { return height - y(binValArray[i]) + 10; });

        g.append("text")
            .attr('class', 'val')
            .attr('x', function() {
                return x(d);
            })
            .attr('y', function() {
                return y(binValArray[i]) - 15;
            })
            .text(function() {
                return [+binValArray[i]];  // Value of the text
            });
    }

    //mouseout event handler function
    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', x.bandwidth())
            .attr("y", function() { return y(binValArray[i]); }) // What if we don't again fix this Value ?
            .attr("height", function() { return height - y(binValArray[i]); }); // Play with changing the Value

        d3.selectAll('.val')
            .remove()
    }

    function onClick() {
        chartType = 1;
        document.getElementById("mysvg").innerHTML = "";
        drawPieChart(data, noOfBins);
    }
}