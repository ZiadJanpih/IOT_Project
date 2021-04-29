var total_max;
$(document).ready(function () {


    start();
    bar_chart();
    /*  try {
          var buildings_ddl = $("[id*=buildings_ddl]");
          var selectedText = buildings_ddl.find("option:selected").text();
          var selectedValue = buildings_ddl.val();
          if (selectedValue != undefined) {
              start(selectedValue);
          }
          else {
              var x = undefined;
              start(x);
          }
      } catch (error) {
          console.log(error);
      
      */

})




function update(nodes, building_id) {
    var lines = parseInt((nodes.length / 6).toFixed(0)) + 1;
    var index = 0;
    var total_values = 0;
    total_max = 0;
    d3.select("#Rooms_table").selectAll("*").remove();
    d3.select("#building_per").selectAll("*").remove();
    for (i = 0; i < lines; i++) {
        var tr = d3.select("#Rooms_table").append("tr");
        for (j = 0; j < 6; j++) {
            if (index < nodes.length) {
                total_values += nodes[index].p_count;
                total_max += nodes[index].maxquantity;
                var td = tr.append("td");
                var per = (nodes[index].p_count * 100) / nodes[index].maxquantity;
                td.append("span")
                    .attr("class", "caption")
                    .style("width", "100%")
                    .style("font-size", "18px")
                    .style("display", "block")
                    .style("text-align", "left")
                    .text(nodes[index].name + " [" + nodes[index].p_count + "/" + nodes[index].maxquantity + "]");

                var out_div = td.append("div")
                switch (true) {
                    case (per < 60):
                        out_div.attr("class", "c100 p" + per.toFixed(0) + " green");
                        break;
                    case (per < 90):
                        out_div.attr("class", "c100 p" + per.toFixed(0) + " orange");
                        break;
                    case (per < 100):
                        out_div.attr("class", "c100 p" + per.toFixed(0) + "  red");
                        break;
                    default:
                        out_div.attr("class", "c100 p100 red");
                        break;
                }

                var spn = out_div
                    .append("span")
                    .text(per.toFixed(0) + "%");

                var inner_div1 = out_div
                    .append("div")
                    .attr("class", "slice");

                var inner_div2 = inner_div1
                    .append("div")
                    .attr("class", "bar");

                var inner_div3 = inner_div1
                    .append("div")
                    .attr("class", "fill");
                td.append("br");
            }
            index++;
        }
    }
    if (total_max > 0) {
        var td = d3.select("#building_per");
        var per = (total_values * 100) / total_max;
        td.append("span")
            .attr("class", "caption")
            .style("width", "100%")
            .style("font-size", "25px")
            .style("display", "block")
            .style("text-align", "left")
            .text("[" + total_values + "/" + total_max + "]");

        var out_div = td.append("div")
        switch (true) {
            case (per < 60):
                out_div.attr("class", "c100 p" + per.toFixed(0) + " big green");
                break;
            case (per < 90):
                out_div.attr("class", "c100 p" + per.toFixed(0) + " big orange");
                break;
            case (per < 100):
                out_div.attr("class", "c100 p" + per.toFixed(0) + " big red");
                break;
            default:
                out_div.attr("class", "c100 p100 big red");
                break;
        }

        var spn = out_div
            .append("span")
            .text(per.toFixed(0) + "%");

        var inner_div1 = out_div
            .append("div")
            .attr("class", "slice");

        var inner_div2 = inner_div1
            .append("div")
            .attr("class", "bar");

        var inner_div3 = inner_div1
            .append("div")
            .attr("class", "fill");
        td.append("br");
    }
}
var is_update = true;
function start() {
    setTimeout(function () {
        var buildings_ddl = $("[id*=buildings_ddl]");
        var selectedText = buildings_ddl.find("option:selected").text();
        var building_id = buildings_ddl.val();

        if (building_id != undefined) {
            $.ajax({
                url: "Default.aspx/get_rooms_data",
                data: "{\"building_id\":\"" + building_id + "\"}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (json) {
                    //data = JSON.parse(json);
                    update(json.d, building_id);
                },
                error: function (request, err, ex) {
                    console.log(err, ex);
                    start_v();
                }
            });
        } else {
            start_v();
        }

        if (is_update) start();
    }, 1000);
}






function bar_chart() {
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%H:%M").parse;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%H:%M"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("#building_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    update_barchart();
    function update_barchart() {
        setTimeout(function () {
            var buildings_ddl = $("[id*=buildings_ddl]");
            var selectedText = buildings_ddl.find("option:selected").text();
            var building_id = buildings_ddl.val();
            var zx = 0;
            if (building_id != undefined) {
                $.ajax({
                    url: "Default.aspx/get_dashbord_count_h",
                    data: "{\"building_id\":\"" + building_id + "\"}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (json) {

                        var data = json.d;

                        data.forEach(function (d) {
                            d.date = parseDate(d.date);
                            d.value = +d.value;
                        });
                        x.domain(data.map(function (d) { return d.date; }));
                        y.domain([0, d3.max(data, function (d) {
                            if (d.value > total_max)
                                return d.value + (d.value/2);
                            else
                                return total_max + (total_max/2);
                        })]);
                        svg.selectAll("*").remove();
                        var x_Axis =svg.append("g")
                            .attr("class", "x axis")                           
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis)
                            .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("dx", "-.8em")
                            .attr("dy", "-.55em")
                            .attr("transform", "rotate(-60)");

                        var y_Axis =svg.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")                          
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("Number of People");

                        var chart = svg.selectAll("bar")
                            .data(data);
                        chart.exit().remove();
                        chart.enter().append("rect")
                            .style("fill", function (d) {
                                var per = (d.value * 100) / total_max;
                                if (per < 60)
                                    return "green";
                                if (per < 90)
                                    return "orange";
                                if (per <= 100)
                                    return "orangered";
                                else
                                    return "red";

                            })
                            .attr("x", function (d) { return x(d.date); })
                            .attr("width", x.rangeBand())
                            .attr("y", function (d) { return y(d.value); })
                            .attr("height", function (d) { return height - y(d.value); });

                        svg.append('line')
                            .attr('x1', 0)
                            .attr('y1', function (d) { return y(total_max); })
                            .attr('x2', width)
                            .attr('y2', function (d) { return y(total_max); })
                            .attr('stroke', 'red');


                        y_Axis.transition()
                            .duration(1000)
                            .call(yAxis);

                        x_Axis.transition()
                            .duration(1000)
                            .call(xAxis);

                    },
                    error: function (request, err, ex) {
                        console.log(err, ex);
                        bar_chart_v();
                    }
                });
            } else {
                bar_chart_v();
            }
            if (is_update) update_barchart();
        }, 1000);
    }
}



function start_v() {
    d3.json("d.json", function (error, graph) {
        if (error) throw error;
        update_v(graph.nodes);
        bar_chart_v(1);
    });
}

function bar_chart_v(max) {
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%H:%M").parse;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%H:%M"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var tr = d3.select("#Buliding_table").select("tr");
    var td = tr.append("td");
    var svg = td.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.json("z.json", function (error, data) {

        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });

        x.domain(data.map(function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-60)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Number of People");
        var chart = svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", function (d) {
                var per = (d.value * 100) / max;
                if (per < 60)
                    return "green";
                if (per < 90)
                    return "orange";
                if (per <= 100)
                    return "orangered";
                else
                    return "red";

                /*  if (d.value <max)
                      return "steelblue";
                      else
                      return "red";*/

            })
            .attr("x", function (d) { return x(d.date); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); });

        svg.append('line')
            .attr('x1', 0)
            .attr('y1', function (d) { return y(max); })
            .attr('x2', width)
            .attr('y2', function (d) { return y(max); })
            .attr('stroke', 'red');
    });
}
function update_v(nodes) {
    var lines = parseInt((nodes.length / 7).toFixed(0)) + 1;
    var index = 0;
    var total_values = 0;
    total_max = 0;
    d3.select("#Rooms_table").selectAll("*").remove();
    d3.select("#Buliding_table").selectAll("*").remove();
    for (i = 0; i < lines; i++) {
        var tr = d3.select("#Rooms_table").append("tr");
        for (j = 0; j < 7; j++) {
            if (index < nodes.length) {
                total_values += nodes[index].value;
                total_max += nodes[index].max;
                var td = tr.append("td");
                var per = (nodes[index].value * 100) / nodes[index].max;


                var out_div = td.append("div")
                switch (true) {
                    case (per < 60):
                        out_div.attr("class", "c100 p" + per.toFixed(0) + " green");
                        break;
                    case (per < 90):
                        out_div.attr("class", "c100 p" + per.toFixed(0) + " orange");
                        break;
                    case (per < 100):
                        out_div.attr("class", "c100 p" + per.toFixed(0) + "  red");
                        break;
                    default:
                        out_div.attr("class", "c100 p100 red");
                        break;
                }

                var spn = out_div
                    .append("span")
                    .text(per.toFixed(0) + "%");

                var inner_div1 = out_div
                    .append("div")
                    .attr("class", "slice");

                var inner_div2 = inner_div1
                    .append("div")
                    .attr("class", "bar");

                var inner_div3 = inner_div1
                    .append("div")
                    .attr("class", "fill");
                td.append("br");
            }
            index++;
        }
    }
    if (total_max > 0) {
        var tr = d3.select("#Buliding_table").append("tr");
        var td = tr.append("td");
        var per = (total_values * 100) / total_max;

        var out_div = td.append("div")
        switch (true) {
            case (per < 60):
                out_div.attr("class", "c100 p" + per.toFixed(0) + " big green");
                break;
            case (per < 90):
                out_div.attr("class", "c100 p" + per.toFixed(0) + " big orange");
                break;
            case (per < 100):
                out_div.attr("class", "c100 p" + per.toFixed(0) + " big red");
                break;
            default:
                out_div.attr("class", "c100 p100 big red");
                break;
        }

        var spn = out_div
            .append("span")
            .text(per.toFixed(0) + "%");

        var inner_div1 = out_div
            .append("div")
            .attr("class", "slice");

        var inner_div2 = inner_div1
            .append("div")
            .attr("class", "bar");

        var inner_div3 = inner_div1
            .append("div")
            .attr("class", "fill");
        td.append("br");
    }
}