<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="FrontEnd._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <style>
        .control1 {
            display: block;
            align-content: flex-start;
            margin-right: 20px;
            margin-left: 20px;
        }
    </style>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <link href="styles/circle.css" rel="stylesheet" />
    <script src="https://d3js.org/d3.v3.min.js"></script>
    <script src="Scripts/dashboard.js"></script>
    <h1>People in Building  </h1>
    <div>
        <table>
            <tr>
                <td>
                    <h4>Select the Building  </h4>
                </td>
                <td>
                    <asp:DropDownList ID="buildings_ddl" runat="server" CssClass="control1" DataSourceID="BuildingDataSource" DataTextField="name" DataValueField="id" onchange="start(this.options[this.selectedIndex].value);"></asp:DropDownList>
                    <asp:ObjectDataSource ID="BuildingDataSource" runat="server" SelectMethod="get_buildings" TypeName="FrontEnd.Control.ServerData">
                        <SelectParameters>
                            <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                        </SelectParameters>
                    </asp:ObjectDataSource>
                </td>
            </tr>
        </table>
    </div>
    <table id="Buliding_table" class="Building_table">
        <tr>
            <td id="building_per"></td>
            <td>
                <svg id="building_bar">
                    <g id="xAxis"></g>
                    <g id="yAxis"></g>
                </svg>
            </td>
        </tr>
    </table>
    <br>
    <table id="Rooms_table" class="control_table"></table>
</asp:Content>
