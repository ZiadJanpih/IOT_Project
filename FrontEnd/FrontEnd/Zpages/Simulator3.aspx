<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Simulator3.aspx.cs" Inherits="FrontEnd.Zpages.Simulator3" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <style>
        .drow_area {
            display: block;
            align-content: center;
            margin: auto;
            border: solid;
            border-color: black;
            border-width: 2px;
        }

        .links line {
            stroke: gray;
            stroke-opacity: 0.6;
        }

        .nodes circle {
            cursor: move;
            stroke: #fff;
            stroke-width: 2px;
        }

        text {
            font-family: sans-serif;
            font-size: 15px;
        }

        .control_table {
            width: 100%;
            margin: 20px;
        }

            .control_table tr {
                width: 100%;
            }

                .control_table tr td {
                    width: 33%;
                    padding-left: 5%;
                    padding-right: 5%;
                }


        .control_width {
            display: block;
            align-content: center;
            margin: auto;
            width: 50%;
        }

        .slider {
            width: 100%;
            max-width: 100%;
        }

            .slider:hover {
                opacity: 1;
            }
    </style>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <div class="drow_area" style="margin: 20px">
        <table class="control_table">
            <tr>
                <td>
                    <asp:Label runat="server" ID="controls_message" ForeColor="Red" BorderStyle="None" HorizontalAlign="Center" Width="100%"></asp:Label>
                </td>
            </tr>
            <tr>
                <td>Select Building
                   <asp:DropDownList ID="buildings_ddl" runat="server" CssClass="control_width" DataSourceID="BuildingDataSource" DataTextField="name" DataValueField="id"></asp:DropDownList>
                    <asp:ObjectDataSource ID="BuildingDataSource" runat="server" SelectMethod="get_buildings" TypeName="FrontEnd.Control.ServerData">
                        <SelectParameters>
                            <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                        </SelectParameters>
                    </asp:ObjectDataSource>
                </td>
                <td>
                    <asp:Button ID="building_graph" Text="Building Graph" runat="server" CssClass="btn btn-primary btn-block btn-large control_width" UseSubmitBehavior="false" OnClientClick="start_drow();return false;"></asp:Button>
                </td>
            </tr>
            <tr>
                <td>
                    <p>Scanning interval / s : <span id="scan_int_text"></span></p>
                    <input type="range" min="1" max="10" value="1" class="slider" id="scan_int">
                </td>
                <td>
                    <p>Lecture duration / m : <span id="Lecture_duration_text"></span></p>

                    <input type="range" min="1" max="120" value="45" class="slider" id="Lecture_duration">
                </td>
                <td>
                    <p>Corridor duration / m : <span id="corridor_duration_text"></span></p>

                    <input type="range" min="1" max="30" value="10" class="slider" id="corridor_duration">
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label runat="server" ID="Label1" ForeColor="Red" BorderStyle="None" HorizontalAlign="Center" Width="100%"></asp:Label>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Button ID="sim_start" Text="Start Simulation" runat="server" CssClass="btn btn-primary btn-block btn-large" UseSubmitBehavior="false" OnClientClick="start_simulation(); return false;"></asp:Button>
                </td>
                <td>
                    <asp:Button ID="sim_stop" Text="Stop Simulation" runat="server" CssClass="btn btn-primary btn-block btn-large" UseSubmitBehavior="false" OnClientClick="stop();return false;"></asp:Button>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <br />
                    <p>Number of People: <span id="demo"></span></p>
                    <input type="range" min="0" max="0" value="0" class="slider" id="myRange">
                </td>
            </tr>
        </table>

    </div>
    <br />
    <div>
        <svg width="1000" height="600" class="drow_area"></svg>
    </div>
    <script>
        var slider = document.getElementById("myRange");
        var output = document.getElementById("demo");
        output.innerHTML = slider.value;
        slider.oninput = function () {
            output.innerHTML = this.value;
        }
        var scan_int = document.getElementById("scan_int");
        var scan_int_text = document.getElementById("scan_int_text");
        scan_int_text.innerHTML = scan_int.value;
        scan_int.oninput = function () {
            scan_int_text.innerHTML = this.value;
        }
        var Lecture_duration = document.getElementById("Lecture_duration");
        var Lecture_duration_text = document.getElementById("Lecture_duration_text");
        Lecture_duration_text.innerHTML = Lecture_duration.value;
        Lecture_duration.oninput = function () {
            Lecture_duration_text.innerHTML = this.value;
        }
        var corridor_duration = document.getElementById("corridor_duration");
        var corridor_duration_text = document.getElementById("corridor_duration_text");
        corridor_duration_text.innerHTML = corridor_duration.value;
        corridor_duration.oninput = function () {
            corridor_duration_text.innerHTML = this.value;
        }
        d3.request("Simulator3.aspx/get_users")
            .header("Content-Type", "application/json; charset=utf-8")
            .post(function (data) {
                count = JSON.parse(data.response);
                if (count.d && count.d > 0) {
                    slider.max = count.d;
                    slider.value = (count.d / 2).toFixed(0);
                    output.innerHTML = slider.value;
                }
            });

        $(document).ready(function () {
            document.getElementById("<%=building_graph.ClientID%>").disabled = false;
            document.getElementById("<%=sim_start.ClientID%>").disabled = true;
            document.getElementById("<%=sim_stop.ClientID%>").disabled = true;
        });

        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }).strength(0.01))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));


        function start(nodes, links) {

            simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) { return d.id; }).strength(0.01))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2));

            svg.selectAll("*").remove();
            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(nodes)
                .enter().append("g")

            var circles = node.append("circle")
                .attr("r", 25)
                .attr("fill", function (d) { return color(d.type); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            var Name = node.append("text")
                .attr("class", "name")
                .text(function (d) {
                    return d.name;
                })
                .attr('x', 20)
                .attr('y', -20);
            var Count = node.append("text")
                .attr("class", "count")
                .text(function (d) {
                    return d.p_count;
                })
                .attr('x', -5)
                .attr('y', 5);

            node.append("title")
                .text(function (d) { return d.name; });

            simulation
                .nodes(nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(links);


            function ticked() {
                link
                    .attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                node
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
            }
        }
        ///----------------------------
        function update(nodes) {
            var new_count = svg.selectAll("text.count")
                .data(nodes)
                .text(function (d) {
                    return d.p_count;
                })
            new_count.transition()
                .duration(400);
        }
        //--------------------

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        var is_update = true;
        function start_drow() {
            var value = document.getElementById("<%=buildings_ddl.ClientID%>");
            var getvalue = value.options[value.selectedIndex].value;
            var gettext = value.options[value.selectedIndex].text;
            $.ajax({
                url: "Simulator3.aspx/Get_building_graph",
                data: "{\"id\":\"" + getvalue + "\", \"name\":\"" + gettext + "\"}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (json) {

                    document.getElementById("<%=building_graph.ClientID%>").disabled = true;
                    document.getElementById("<%=sim_start.ClientID%>").disabled = false;
                    document.getElementById("<%=sim_stop.ClientID%>").disabled = true;


                    start(json.d.nodes, json.d.links);
                },
                error: function (request, err, ex) {
                    console.log(err, ex);
                }
            });
        }

        function start_simulation() {
            var users_count = slider.value;
            var scan_int_v = scan_int.value;
            var Lecture_duration_v = Lecture_duration.value;
            var corridor_duration_v = corridor_duration.value;

            if (users_count > 0) {
                $.ajax({
                    url: "Simulator3.aspx/Start_sim",
                    data: "{\"users_count\":" + users_count + ", \"scan_int\":" + scan_int_v + ", \"Lecture_duration\":" + Lecture_duration_v + ", \"corridor_duration\":" + corridor_duration_v + "}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (json) {
                        is_update = true;
                        start_update();
                    },
                    error: function (request, err, ex) {
                        console.log(err, ex);
                    }
                });
            }
            else {

            }
        }

        function start_update() {
            setTimeout(function () {
                d3.request("Simulator3.aspx/Get_building_graph2")
                    .header("Content-Type", "application/json; charset=utf-8")
                    .post(function (data) {
                        if (is_update) {
                            document.getElementById("<%=building_graph.ClientID%>").disabled = true;
                            document.getElementById("<%=sim_start.ClientID%>").disabled = true;
                            document.getElementById("<%=sim_stop.ClientID%>").disabled = false;

                            obj = JSON.parse(data.response);
                            update(obj.d.nodes);
                        }

                    });
                if (is_update) start_update();
            }, 500);
        }

        function stop() {
            is_update = false;
            d3.request("Simulator3.aspx/stop_sim")
                .header("Content-Type", "application/json; charset=utf-8")
                .post(function (data) {

                });

            document.getElementById("<%=building_graph.ClientID%>").disabled = false;
            document.getElementById("<%=sim_start.ClientID%>").disabled = true;
            document.getElementById("<%=sim_stop.ClientID%>").disabled = true;
        }


    </script>

</asp:Content>
