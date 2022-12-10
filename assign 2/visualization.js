d3.csv("penguins.csv", function(data){
    function tabulate(data, columns) {
        var table = d3.select("#table")
            , columnNames = columns
            , thead = table.append("thead")
            , tbody = table.append("tbody");

        thead.append("tr")
            .selectAll("th")
            .data(columnNames)
            .enter()
            .append("th")
            .style("vertical-align","middle")
            .style("border","1px solid black")
            .text(function (columnNames){return columnNames;});

        thead.selectAll("tr")
            .style("height","40px")

        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");
            
        var cells = rows.selectAll("tr")
            .data(function(row){
                return columns.map(function (column){
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .style("background-color","#ffffff")
            .style("font-size", "1.8vh")
            .style("color", "#09284d")
            .style("padding", "5px")
            .style("width","100px")
            .style("text-align","center")
            .style("border","1px solid black")
            .html(function (d) {return d.value;});
        
        return table;
    };

    tabulate(data, ["Species", "BeakLength", "BeakDepth", "FlipperLength", "BodyMass"]);

    function hist(data, attributes) {

        var margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
        
        var svg = d3.select("#histogram")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        var svg2 = d3.select("#histogram")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
    
        var svg3 = d3.select("#histogram")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        var allGroup = attributes;

        d3.select("#selectButton")
            .selectAll('myOptions')
     	    .data(allGroup)
            .enter()
    	    .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })
        
        var x = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return +d.BeakLength }),
                d3.max(data, function(d) { return +d.BeakLength }) +1])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg2.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg3.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        var histogram = d3.histogram()
            .value(function(d) { if(d.Species=="Adelie") return d.BeakLength; })
            .domain(x.domain())
            .thresholds(x.ticks(30));
        var histogram2 = d3.histogram()
            .value(function(d) { if(d.Species=="Chinstrap") return d.BeakLength; })
            .domain(x.domain())
            .thresholds(x.ticks(30));
        var histogram3 = d3.histogram()
            .value(function(d) { if(d.Species=="Gentoo") return d.BeakLength; })
            .domain(x.domain())
            .thresholds(x.ticks(30));

        var bins = histogram(data);
        var bins2 = histogram2(data);
        var bins3 = histogram3(data);

        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);
        svg.append("g")
            .call(d3.axisLeft(y));
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins2, function(d) { return d.length; })]);
        svg2.append("g")
            .call(d3.axisLeft(y));
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins3, function(d) { return d.length; })]);
        svg3.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "red")
        svg.append("text")
            .style("font-weight","bold")
            .text("Adelie")
        svg2.selectAll("rect")
            .data(bins2)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "green")
        svg2.append("text")
            .style("font-weight","bold")
            .text("Chinstrap")
        svg3.selectAll("rect")
            .data(bins3)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "blue")
        svg3.append("text")
            .style("font-weight","bold")
            .text("Gentoo")

        function update(selectedGroup) {
            d3.select("#histogram")
                .html(null);

            var margin = {top: 20, right: 30, bottom: 30, left: 40},
                width = 400 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;
            
            var svg = d3.select("#histogram")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
    
            var svg2 = d3.select("#histogram")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        
            var svg3 = d3.select("#histogram")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return +d[selectedGroup] }),
                    d3.max(data, function(d) { return +d[selectedGroup] }) +1])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            svg2.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            svg3.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            
            var histogram = d3.histogram()
                .value(function(d) { if(d.Species=="Adelie") return d[selectedGroup]; })
                .domain(x.domain())
                .thresholds(x.ticks(30));
            var histogram2 = d3.histogram()
                .value(function(d) { if(d.Species=="Chinstrap") return d[selectedGroup]; })
                .domain(x.domain())
                .thresholds(x.ticks(30));
            var histogram3 = d3.histogram()
                .value(function(d) { if(d.Species=="Gentoo") return d[selectedGroup]; })
                .domain(x.domain())
                .thresholds(x.ticks(30));

            var bins = histogram(data);
            var bins2 = histogram2(data);
            var bins3 = histogram3(data);

            var y = d3.scaleLinear()
                .range([height, 0]);
                y.domain([0, d3.max(bins, function(d) { return d.length; })]);
            svg.append("g")
                .call(d3.axisLeft(y));
            var y = d3.scaleLinear()
                .range([height, 0]);
                y.domain([0, d3.max(bins2, function(d) { return d.length; })]);
            svg2.append("g")
                .call(d3.axisLeft(y));
            var y = d3.scaleLinear()
                .range([height, 0]);
                y.domain([0, d3.max(bins3, function(d) { return d.length; })]);
            svg3.append("g")
                .call(d3.axisLeft(y));

                svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "red")
            svg.append("text")
                .style("font-weight","bold")
                .text("Adelie")
            svg2.selectAll("rect")
                .data(bins2)
                .enter()
                .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "green")
            svg2.append("text")
                .style("font-weight","bold")
                .text("Chinstrap")
            svg3.selectAll("rect")
                .data(bins3)
                .enter()
                .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "blue")
            svg3.append("text")
                .style("font-weight","bold")
                .text("Gentoo")
        }
        
        d3.select("#selectButton").on("change", function(d) {
        var selectedOption = d3.select(this).property("value")
        update(selectedOption)
        })
    }

    hist(data, ["BeakLength", "BeakDepth", "FlipperLength", "BodyMass"]);

    function parallel(data){

        var margin = {top: 30, right: 10, bottom: 10, left: 10},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select("#parallel")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var color = d3.scaleOrdinal()
            .domain(["Adelie", "Chinstrap", "Gentoo" ])
            .range([ "red", "green", "blue"])

        dimensions = ["BeakLength", "BeakDepth", "FlipperLength", "BodyMass"]

        var y = {}
        for (i in dimensions) {
            attname = dimensions[i]
            y[attname] = d3.scaleLinear()
                .domain( d3.extent(data, function(d) { return +d[attname]; }) )
                .range([height, 0])
        }
        
        x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);
        
        var highlight = function(d){

            selected_specie = d.Species

            d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")

            d3.selectAll("." + selected_specie)
            .transition().duration(200)
            .style("stroke", color(selected_specie))
            .style("opacity", "1")
        }

        var doNotHighlight = function(d){
            d3.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("stroke", function(d){ return( color(d.Species))} )
            .style("opacity", "1")
        }

        function path(d) {
            return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
        }

        svg.selectAll("myPath")
            .data(data)
            .enter()
            .append("path")
            .attr("class", function (d) { return "line " + d.Species } )
            .attr("d",  path)
            .style("fill", "none")
            .style("stroke", function(d){ return( color(d.Species))})
            .style("opacity", 0.5)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight )

        svg.selectAll("myAxis")
            .data(dimensions).enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            .append("text")
              .style("text-anchor", "middle")
              .attr("y", -9)
              .text(function(d) { return d; })
              .style("fill", "black")
    }

    parallel(data);

    function scatter(data){

        attributes = ["BeakLength", "BeakDepth", "FlipperLength", "BodyMass"]

        d3.select("#selectX")
            .selectAll('myOptions')
     	    .data(attributes)
            .enter()
    	    .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })
        
        d3.select("#selectY")
            .selectAll('myOptions')
     	    .data(attributes)
            .enter()
    	    .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })

        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#scatter")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        
        var x = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return +d.BeakLength }),
                d3.max(data, function(d) { return +d.BeakLength })])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return +d.BeakLength }),
                d3.max(data, function(d) { return +d.BeakLength })])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var color = d3.scaleOrdinal()
            .domain(["Adelie", "Chinstrap", "Gentoo" ])
            .range([ "red", "green", "blue"])

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.BeakLength); } )
              .attr("cy", function (d) { return y(d.BeakLength); } )
              .attr("r", 2)
              .style("fill", function (d) { return color(d.Species) } )

        function updateXY(selectedX, selectedY){

            d3.select("#scatter")
                .html(null);

            var margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
    
            var svg = d3.select("#scatter")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
            
            var x = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return +d[selectedX] }),
                    d3.max(data, function(d) { return +d[selectedX] })])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
    
            var y = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return +d[selectedY] }),
                    d3.max(data, function(d) { return +d[selectedY] })])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));
    
            var color = d3.scaleOrdinal()
                .domain(["Adelie", "Chinstrap", "Gentoo" ])
                .range([ "red", "green", "blue"])
    
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                  .attr("cx", function (d) { return x(d[selectedX]); } )
                  .attr("cy", function (d) { return y(d[selectedY]); } )
                  .attr("r", 2)
                  .style("fill", function (d) { return color(d.Species) } )
        }

        var selectedX = "BeakLength",
            selectedY = "BeakLength";

        d3.select("#selectX").on("change", function(d) {
            selectedX = d3.select(this).property("value")
            updateXY(selectedX, selectedY)
        })
        d3.select("#selectY").on("change", function(d) {
            selectedY = d3.select(this).property("value")
            updateXY(selectedX, selectedY)
        })
    }

    scatter(data);

    function tsne(data){

        var perplexity, earlyExaggeration, learningRate, nIter, metric;

        metrics = ["euclidean", "manhattan", "jaccard", "dice"]

        d3.select("#selectMetric")
            .selectAll('myOptions')
            .data(metrics)
            .enter()
            .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })

        d3.select("#selectMetric")
            .on("change", function(d) { metric = d3.select(this).property("value") })

        var dataArray = [];

        for(var i=0; i<data.length; i++){
            var tempArray = [];
            tempArray[0] = data[i].BeakLength;
            tempArray[1] = data[i].BeakDepth;
            tempArray[2] = data[i].FlipperLength;
            tempArray[3] = data[i].BodyMass;
            dataArray[i] = tempArray;
        }

        document.getElementById("button").onclick = function () {

            d3.select("#tsne")
                .html(null);

            perplexity = document.getElementById("perplexity").value;
            earlyExaggeration = document.getElementById("earlyExaggeration").value;
            learningRate = document.getElementById("learningRate").value;
            nIter = document.getElementById("nIter").value;

            let model = new TSNE({
                dim: 2,
                perplexity: perplexity,
                earlyExaggeration: earlyExaggeration,
                learningRate: learningRate,
                nIter: nIter,
                metric: metric
            });

            model.init({
                data: dataArray,
                type: 'dense'
            });

            let [error, iter] = model.run();
            let output = model.getOutput();
            let outputScaled = model.getOutputScaled();

            var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

            var svg = d3.select("#tsne")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        
            var x = d3.scaleLinear()
                .domain([-1, 1])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            var y = d3.scaleLinear()
                .domain([-1, 1])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            var tsneA = [],
                tsneC = [],
                tsneG = [];
            
            // Adelie: 0~150, Chinstrap: 151~218, Gentoo: 219~341
            for (var i=0; i<outputScaled.length; i++) {
                var tempObject = {x, y};
                if (i<151) {
                    tempObject.x = outputScaled[i][0];
                    tempObject.y = outputScaled[i][1];
                    tsneA[i] = tempObject;
                }
                else if (i>=151 && i<219) {
                    tempObject.x = outputScaled[i][0];
                    tempObject.y = outputScaled[i][1];
                    tsneC[i-151] = tempObject;
                }
                else if (i>=219 && i<342) {
                    tempObject.x = outputScaled[i][0];
                    tempObject.y = outputScaled[i][1];
                    tsneG[i-219] = tempObject;
                }
            }

            svg.append('g')
                .selectAll("dot")
                .data(tsneA)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .attr("r", 2)
                .style("fill", "red")

            svg.append('g')
                .selectAll("dot")
                .data(tsneC)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .attr("r", 2)
                .style("fill", "green")

            svg.append('g')
                .selectAll("dot")
                .data(tsneG)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .attr("r", 2)
                .style("fill", "blue")
        }
    }

    tsne(data);

});