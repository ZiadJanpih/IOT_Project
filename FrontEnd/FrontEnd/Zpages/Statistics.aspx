<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Statistics.aspx.cs" Inherits="FrontEnd.Zpages.Statistics" EnableViewState="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">

    <style>
        .control1 {
            display: block;
            align-content: flex-start;
            margin-right: 20px;
            margin-left: 20px;
        }

        .control2 {
            align-content: flex-start;
            margin-right: 20px;
            margin-left: 20px;
        }

        .control_table {
            width: 100%;
            margin: 20px;
        }

            .control_table tr {
                width: 100%;
            }

                .control_table tr td {
                    width: 20%;
                    padding-left: 5%;
                    padding-right: 5%;
                }

        .control_table1 {
            width: 100%;
            margin: 20px;
        }

            .control_table1 tr {
                width: 100%;
            }

                .control_table1 tr td {
                    width: 16%;
                }
    </style>

    <script src="https://d3js.org/d3.v4.js"></script>
    <script src="../Scripts/jquery-3.5.1.min.js"></script>
    <script src="../Scripts/statistics.js"></script>
    <br />


    <table class="control_table">
        <tr>
            <td>From Date
                <input type="date" id="from_date" name="from_date" value="2021-01-01">
            </td>
            <td>To Date
                <input type="date" id="to_date" name="to_date" value="2021-12-31">
            </td>
            <td>Building
                <asp:DropDownList ID="buildings_ddl" runat="server" CssClass="control1" DataSourceID="BuildingDataSource" DataTextField="name" DataValueField="id"
                    OnSelectedIndexChanged="buildings_ddl_SelectedIndexChanged" AutoPostBack="true" >
                </asp:DropDownList>
                <asp:ObjectDataSource ID="BuildingDataSource" runat="server" SelectMethod="get_buildings" TypeName="FrontEnd.Control.ServerData">
                    <SelectParameters>
                        <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                    </SelectParameters>
                </asp:ObjectDataSource>
            </td>
            <td>Floor
                <asp:DropDownList ID="floors_ddl" runat="server" CssClass="control1" DataTextField="name" DataValueField="id" DataSourceID="FloorsDatasource"
                    OnSelectedIndexChanged="floors_ddl_SelectedIndexChanged" AutoPostBack="true">
                </asp:DropDownList>
                <asp:ObjectDataSource ID="FloorsDatasource" runat="server" SelectMethod="get_building_floors_dll" TypeName="FrontEnd.Control.ServerData">
                    <SelectParameters>
                        <asp:ControlParameter ControlID="buildings_ddl" Name="building_id" PropertyName="SelectedValue" Type="String" />
                        <asp:SessionParameter Name="accessToken" SessionField="__AccessToken" Type="String" />
                    </SelectParameters>
                </asp:ObjectDataSource>
                <td>Room/Corridor
                <asp:DropDownList ID="rooms_ddl" runat="server" CssClass="control1" DataTextField="name" DataValueField="id" DataSourceID="RoomsDataSource">
                </asp:DropDownList>
                    <asp:ObjectDataSource ID="RoomsDataSource" runat="server" TypeName="FrontEnd.Control.ServerData" SelectMethod="get_floor_parts">
                        <SelectParameters>
                            <asp:ControlParameter ControlID="floors_ddl" Name="floor_id" PropertyName="SelectedValue" Type="String" />
                            <asp:SessionParameter Name="accessToken" SessionField="__AccessToken" Type="String" />
                        </SelectParameters>
                    </asp:ObjectDataSource>
                </td>
        </tr>
    </table>
    <br />
    <br />
    <table class="control_table1">
        <tr>
            <td>
                <asp:RadioButton ID="Radio_DayHour" GroupName="G1"  Checked="True" Text=" DayHour" runat="server" CssClass="control1" />
            </td>
<%--            <td>
                <asp:RadioButton ID="Radio__Day" GroupName="G1" Text=" Day" runat="server" CssClass="control1" />
            </td>--%>
            <td>
                <asp:RadioButton ID="Radio_WeekDay" GroupName="G1" Text=" WeekDay" runat="server" CssClass="control1" />
            </td>
            <td>
                <asp:RadioButton ID="Radio_DayMonth" GroupName="G1" Text=" DayMonth" runat="server" CssClass="control1" />
            </td>
            <td>
                <asp:RadioButton ID="Radio_Monthly" GroupName="G1" Text=" Monthly" runat="server" CssClass="control1" />
            </td>
            <td>
                <asp:RadioButton ID="Radio_MonthYear" GroupName="G1" Text=" MonthYear" runat="server" CssClass="control1" />
            </td>
            <td>
                <asp:RadioButton ID="Radio_Yearly" GroupName="G1" Text=" Yearly" runat="server" CssClass="control1" />

            </td>
        </tr>
    </table>

    <table style="width: 100%">
        <tr style="width: 100%">
            <td style="width: 50%">
                <h3>Min & Max Count of people</h3>
                <div style="border-style: solid; width: 90%; height: 320px">
                    <br />
                    <svg id="min_max_bar">
                        <g id="min_max_xAxis"></g>
                        <g id="min_max_yAxis"></g>
                        <g id="min_max_bars"></g>
                    </svg>

                </div>
            </td>

            <td style="width: 50%">
                <h3>Average Count of people</h3>
                <div style="border-style: solid; width: 90%; height: 320px">
                    <br />
                    <svg id="avg_bar">
                        <g id="xAxis"></g>
                        <g id="yAxis"></g>
                        <g id="bars"></g>
                    </svg>
                </div>
            </td>
        </tr>
    </table>


</asp:Content>
