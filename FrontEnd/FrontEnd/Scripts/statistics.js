
$(document).ready(function () {
    update();





    $("[id*=from_date]").on('change', function () {

        update();

    });

    $("[id*=to_date]").on('change', function () {

        update();

    });
    $("[id*=rooms_ddl]").on('change', function () {

        update();

    });


    $("[id*=floors_ddl]").on('change', function () {

        update();

    });
    $("[id*=buildings_ddl]").on('change', function () {

        update();
    });

    $("[id*=Radio_DayHour]").on('change', function () {
        //bar_chart();
        update();

    });

    $("[id*=Radio__Day]").on('change', function () {
        //bar_chart();
        update();

    });

    $("[id*=Radio_WeekDay]").on('change', function () {
        //bar_chart();
        update();

    });
    $("[id*=Radio_DayMonth]").on('change', function () {
        //bar_chart();
        update();

    });
    $("[id*=Radio_Monthly]").on('change', function () {
        //bar_chart();
        update();

    });
    $("[id*=Radio_MonthYear]").on('change', function () {
        //bar_chart();
        update();

    });
    $("[id*=Radio_Yearly]").on('change', function () {
        //bar_chart();
        update();

    });

})

function get_entity() {
    res = null;
    var rooms_value = $("[id*=rooms_ddl] option:selected").val();
    var rooms_text = $("[id*=rooms_ddl] option:selected").text();
    if (rooms_value != undefined && rooms_value != null && rooms_value != '0') {
        if (rooms_text.toUpperCase().includes('R') || rooms_text.toUpperCase().includes('E')) {

            return {
                entityId: rooms_value,
                type: 'Room'
            };
        }
        else {
            return {
                entityId: rooms_value,
                type: 'Corridor'
            };
        }
    }

    var floors_value = $("[id*=floors_ddl] option:selected").val();
    var floors_text = $("[id*=floors_ddl] option:selected").text();
    if (rooms_value != undefined && rooms_value != null && rooms_value != '0') {
        return {
            entityId: floors_value,
            type: 'Floor'
        };

    }

    var building_value = $("[id*=buildings_ddl] option:selected").val();

    return {
        entityId: building_value,
        type: 'Building'
    };

}


function get_aggregationType() {
    res = "Hourly";
    if ($('[id*=Radio_DayHour]').is(":checked"))
        res = "Hourly";
    else
        if ($('[id*=Radio__Day]').is(":checked"))
            res = "Daily";
        else
            if ($('[id*=Radio_WeekDay]').is(":checked"))
                res = "DayWeek";
            else
                if ($('[id*=Radio_DayMonth]').is(":checked"))
                    res = "DayMonth";
                else
                    if ($('[id*=Radio_Monthly]').is(":checked"))
                        res = "Monthly";
                    else
                        if ($('[id*=Radio_MonthYear]').is(":checked"))
                            res = "MonthYear";
                        else
                            if ($('[id*=Radio_Yearly]').is(":checked"))
                                res = "Yearly";


    return res;

}

function get_from_date() {


    return document.getElementById("from_date").value;

}



function get_to_date() {

    return document.getElementById("to_date").value;;

}




function bar_chart() {
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%H:%M").parse;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("#avg_bar");
    //.selectAll("*").remove();
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    update_barchart();
    function update_barchart() {

        var entity = get_entity();
        var entityId = entity.entityId;
        var type = entity.type;
        var aggregationType = get_aggregationType();
        var from_date = get_from_date();
        var to_date = get_to_date();
        $.ajax({
            url: "Statistics.aspx/get_statistic_avg",
            data: "{\"entityId\":\"" + entityId + "\""
                + ",\"type\":\"" + type + "\""
                + ",\"aggregationType\":\"" + aggregationType + "\""
                + ",\"fromDate\":\"" + from_date + "\""
                + ",\"toDate\":\"" + to_date
                + "\"}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (json) {

                var data = json.d;

                /* data.forEach(function (d) {
                     d.date = d.date;
                     d.value = +d.value;
                 });*/
                x.domain(data.map(function (d) { return d.date; }));
                y.domain([0, d3.max(data, function (d) {
                    return d.value + (d.value / 3);
                })]);

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
                        return "green";
                        //return "orange";
                        //return "orangered";
                        //return "red";
                    })
                    .attr("x", function (d) { return x(d.date); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) { return y(d.value); })
                    .attr("height", function (d) { return height - y(d.value); });


            },
            error: function (request, err, ex) {
                console.log(err, ex);
                // bar_chart_v();
            }
        });
    }
}

function update() {

    var entity = get_entity();
    var entityId = entity.entityId;
    var type = entity.type;
    var aggregationType = get_aggregationType();
    var from_date = get_from_date();
    var to_date = get_to_date();
    // Avg visualization
    $.ajax({
        url: "Statistics.aspx/get_statistic_avg",
        data: "{\"entityId\":\"" + entityId + "\""
            + ",\"type\":\"" + type + "\""
            + ",\"aggregationType\":\"" + aggregationType + "\""
            + ",\"fromDate\":\"" + from_date + "\""
            + ",\"toDate\":\"" + to_date
            + "\"}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (json) {

            var data = json.d;
            create_avg_BarChart(data);
            //createBarChart2(data);
        },
        error: function (request, err, ex) {
            console.log(err, ex);
            // bar_chart_v();
        }
    });

    // Min_Max visualization
    $.ajax({
        url: "Statistics.aspx/get_statistic_MainMax",
        data: "{\"entityId\":\"" + entityId + "\""
            + ",\"type\":\"" + type + "\""
            + ",\"aggregationType\":\"" + aggregationType + "\""
            + ",\"fromDate\":\"" + from_date + "\""
            + ",\"toDate\":\"" + to_date
            + "\"}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (json) {

            var data = json.d;
            create_min_max_BarChart(data);
            //createBarChart2(data);
        },
        error: function (request, err, ex) {
            console.log(err, ex);
            // bar_chart_v();
        }
    });

}

function create_avg_BarChart(data) {

    var svgBounds = d3.select("#avg_bar").node().getBoundingClientRect();

    var margin = { top: 0, right: 0, bottom: 70, left: 70 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);



    var colorScale = d3.scaleLinear().domain([0, d3.max(data, function (d) {
        return d.value;
    })]).range(['lightblue', 'darkblue']);


    var svg = d3.select("#avg_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


    x.domain(data.map(function (d) {
        return d.date;
    }));

    y.domain([0, d3.max(data, function (d) {
        return d.value + (d.value / 3);
    })]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);


    svg.select("#xAxis")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-75)");

    svg.select("#yAxis")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em");



    var bars = svg.select("#bars").selectAll("rect")
        .data(data);
    bars.exit().remove();
    bars.enter().append("rect")
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.value); })
        .attr("transform",
            "translate(" + margin.left + ",0)")
        .style("fill", function (d) {
            return colorScale(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return (height - y(d.value));
        });


    bars.transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.value); })
        .attr("transform",
            "translate(" + margin.left + ",0)")
        .style("fill", function (d) {
            return colorScale(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return (height - y(d.value));
        });

    svg.select("#yAxis")
        .transition()
        .duration(1000)
        .call(yAxis);

    svg.select("#xAxis")
        .transition()
        .duration(1000)
        .call(xAxis);

}

function create_min_max_BarChart(data) {

    var svgBounds = d3.select("#min_max_bar").node().getBoundingClientRect();

    var margin = { top: 0, right: 0, bottom: 70, left: 70 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var colorScale = d3.scaleLinear().domain([0, d3.max(data, function (d) {
        return d.max;
    })]).range(['lightblue', 'darkblue']);


    var svg = d3.select("#min_max_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


    x.domain(data.map(function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.max + (d.max / 3);
    })]);

    svg.select("#min_max_xAxis")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-75)");

    svg.select("#min_max_yAxis")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em");



    var max_bars = svg.select("#min_max_bars").selectAll(".max_rect")
        .data(data);
    var min_bars = svg.select("#min_max_bars").selectAll(".min_rect")
        .data(data);
    max_bars.exit().remove();
    min_bars.exit().remove();
    max_bars.enter().append("rect")
        .attr("class", "max_rect")
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.max); })
        .attr("transform",
            "translate(" + margin.left + ",0)")
        .style("fill", "darkblue")
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return (height - y(d.max));
        });

    min_bars.enter().append("rect")
        .attr("class", "min_rect")
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.min); })
        .attr("transform",
            "translate(" + margin.left + ",0)")
        .style("fill", "red")
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return (height - y(d.min));
        });


    max_bars.transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.max); })
        .attr("transform",
            "translate(" + margin.left + ",0)")
        .style("fill", "darkblue")
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return (height - y(d.max));
        });

    min_bars.transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.min); })
        .attr("transform",
            "translate(" + margin.left + ",0)")
        .style("fill", "red")
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return (height - y(d.min));
        });

    svg.select("#min_max_yAxis")
        .transition()
        .duration(1000)
        .call(yAxis);

    svg.select("#min_max_xAxis")
        .transition()
        .duration(1000)
        .call(xAxis);

    var min_max = ["Max", "Min"];
    var colors = ["darkblue", "red"];

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (70 + 12) + ', 0)');

    legend.selectAll('rect')
        .data(min_max)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return i * 18;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function (d, i) {
            return colors[i];
        });

    legend.selectAll('text')
        .data(min_max)
        .enter()
        .append('text')
        .text(function (d) {
            return d;
        })
        .attr('x', 18)
        .attr('y', function (d, i) {
            return i * 18;
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging');




}

