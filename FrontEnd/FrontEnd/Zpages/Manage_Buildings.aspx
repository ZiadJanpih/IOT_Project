<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" MaintainScrollPositionOnPostback="true" CodeBehind="Manage_Buildings.aspx.cs" Inherits="FrontEnd.Zpages.Manage_Buildings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">

    <style type="text/css">
        .RowSelected {
            background-color: #669999;
            font-weight: bold;
            color: white;
        }

        .LableMargin_left {
            margin-left: 10%;
        }
    </style>
    <script>

</script>
    <asp:Panel runat="server" GroupingText="Buildings" Font-Bold="true">
        <div style="width: 100%; padding-top: 10px;">

            <asp:GridView ID="buildings_GridView" runat="server" AutoGenerateColumns="False" CellPadding="3" DataKeyNames="id"
                HorizontalAlign="Center" Width="80%" AutoGenerateSelectButton="True" EmptyDataText="Sorry, no data available." ShowHeaderWhenEmpty="True" BackColor="White"
                BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px" DataSourceID="BuildingsDataSource" OnSelectedIndexChanged="buildings_GridView_SelectedIndexChanged">
                <Columns>
                    <asp:BoundField DataField="id" HeaderText="id" InsertVisible="False" SortExpression="id" Visible="False" />
                    <asp:TemplateField HeaderText="Building Name" ItemStyle-Width="80%" SortExpression="control_name">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Building_Name" Text='<%# Eval("name") %>'></asp:Literal>
                        </ItemTemplate>
                        <%--                        <EditItemTemplate>
                            <asp:TextBox runat="server" ID="Building_Name" Text='<%# Bind("name") %>'></asp:TextBox>
                        </EditItemTemplate>--%>
                    </asp:TemplateField>
                </Columns>

                <FooterStyle BackColor="White" ForeColor="#000066" />
                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                <RowStyle ForeColor="#000066" />
                <SelectedRowStyle CssClass="RowSelected" />
                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                <SortedAscendingHeaderStyle BackColor="#007DBB" />
                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                <SortedDescendingHeaderStyle BackColor="#00547E" />

            </asp:GridView>
            <asp:ObjectDataSource ID="BuildingsDataSource" runat="server" SelectMethod="get_buildings" TypeName="FrontEnd.Control.ServerData">
                <SelectParameters>
                    <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                </SelectParameters>
            </asp:ObjectDataSource>
            <br />
            <table style="width: 100%">
                <tr>
                    <td>
                        <asp:Panel ID="AddPanel" runat="server" DefaultButton="add" CssClass="LableMargin_left" Width="80%" HorizontalAlign="Center" EnableViewState="true">
                            <table>
                                <tr>
                                    <td>
                                        <asp:Label runat="server" Width="200px" Text="Add Building">
                                        </asp:Label>
                                    </td>

                                    <td>
                                        <asp:TextBox runat="server" ID="BuildingNameTextBox" Width="200px" ValidationGroup="Add"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:Label ID="lab" Text="" runat="server" Width="100px"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:Button ID="add" runat="server" UseSubmitBehavior="true" Width="100px"
                                            Text="Add" ValidationGroup="G1" OnClick="add_Click" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" Display="Dynamic" runat="server"
                                            ErrorMessage="Building Name is Required!" ForeColor="Red" ControlToValidate="BuildingNameTextBox" ValidationGroup="G1"></asp:RequiredFieldValidator>
                                    </td>
                                    <td></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
    <br />
    <br />
    <asp:Panel runat="server" GroupingText="Building Floors" Font-Bold="true">
        <div style="width: 100%; padding-top: 10px;">
            <asp:Label runat="server" ID="add_floor_message" ForeColor="Red" CssClass="LableMargin_left" BorderStyle="None" HorizontalAlign="Center" Width="80%"></asp:Label>
            <asp:GridView ID="Building_FloorsGridView" runat="server" AutoGenerateColumns="False" CellPadding="3" DataKeyNames="id"
                HorizontalAlign="Center" Width="80%" AutoGenerateSelectButton="True" EmptyDataText="Sorry, no data available." ShowHeaderWhenEmpty="True" BackColor="White"
                BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px" DataSourceID="FloorsDataSource" OnSelectedIndexChanged="buildings_GridView_SelectedIndexChanged">
                <Columns>
                    <asp:BoundField DataField="id" HeaderText="id" InsertVisible="False" SortExpression="id" Visible="False" />
                    <asp:TemplateField HeaderText="Floor Number" ItemStyle-Width="80%" SortExpression="control_name">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Floor_Number" Text='<%# Eval("name") %>'></asp:Literal>
                        </ItemTemplate>
                        <%--                        <EditItemTemplate>
                            <asp:TextBox runat="server" ID="Building_Name" Text='<%# Bind("name") %>'></asp:TextBox>
                        </EditItemTemplate>--%>
                    </asp:TemplateField>
                </Columns>

                <FooterStyle BackColor="White" ForeColor="#000066" />
                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                <RowStyle ForeColor="#000066" />
                <SelectedRowStyle CssClass="RowSelected" />
                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                <SortedAscendingHeaderStyle BackColor="#007DBB" />
                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                <SortedDescendingHeaderStyle BackColor="#00547E" />

            </asp:GridView>

            <asp:ObjectDataSource ID="FloorsDataSource" runat="server" SelectMethod="get_building_floors" TypeName="FrontEnd.Control.ServerData">
                <SelectParameters>
                    <asp:ControlParameter ControlID="buildings_GridView" Name="building_id" PropertyName="SelectedValue" Type="String" DefaultValue="-1" />
                    <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                </SelectParameters>
            </asp:ObjectDataSource>

            <br />
            <table style="width: 100%">
                <tr>
                    <td>
                        <asp:Panel ID="Panel1" runat="server" DefaultButton="add_floor_but" CssClass="LableMargin_left" Width="80%" HorizontalAlign="Center" EnableViewState="true">
                            <table>
                                <tr>
                                    <td>
                                        <asp:Label runat="server" Width="200px" Text="Floor Number">
                                        </asp:Label>
                                    </td>

                                    <td>
                                        <asp:TextBox runat="server" ID="add_floor_TextBox" Width="200px" ValidationGroup="Add_f"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:Label ID="Label1" Text="" runat="server" Width="100px"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:Button ID="add_floor_but" runat="server" UseSubmitBehavior="true" Width="100px"
                                            Text="Add" ValidationGroup="Add_f" OnClick="add_floor_but_Click" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" Display="Dynamic" runat="server"
                                            ErrorMessage="Floor Number is Required!" ForeColor="Red" ControlToValidate="add_floor_TextBox" ValidationGroup="Add_f"></asp:RequiredFieldValidator>
                                        <asp:CompareValidator runat="server" Operator="DataTypeCheck" Type="Integer" ForeColor="Red" ValidationGroup="Add_f"
                                            ControlToValidate="add_floor_TextBox"
                                            ErrorMessage="  Value must be Number !">
                                        </asp:CompareValidator>
                                    </td>
                                    <td></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
    <br />
    <br />
    <asp:Panel runat="server" GroupingText="Floor Corridors" Font-Bold="true">
        <div style="width: 100%; padding-top: 10px;">
            <asp:Label runat="server" ID="add_corridor_message" ForeColor="Red" CssClass="LableMargin_left" BorderStyle="None" HorizontalAlign="Center" Width="80%"></asp:Label>
            <asp:GridView ID="corridors_GridView" runat="server" AutoGenerateColumns="False" CellPadding="3" DataKeyNames="id"
                HorizontalAlign="Center" Width="80%" AutoGenerateSelectButton="True" AutoGenerateEditButton="True" EmptyDataText="Sorry, no data available." ShowHeaderWhenEmpty="True" BackColor="White"
                BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px" DataSourceID="CorridorsDataSource" OnSelectedIndexChanged="buildings_GridView_SelectedIndexChanged" OnRowCommand="corridors_GridView_RowCommand">
                <Columns>
                    <asp:BoundField DataField="id" HeaderText="id" InsertVisible="False" SortExpression="id" Visible="False" />
                    <asp:TemplateField HeaderText="Corridor Number" ItemStyle-Width="18%">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Corridor_Number" Text='<%# Eval("number") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Corridor Name" ItemStyle-Width="18%">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Corridor_Name" Text='<%# Eval("name") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Max Capacity" ItemStyle-Width="18%">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Corridor_max_Number" Text='<%# Eval("maxquantity") %>'></asp:Literal>
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox runat="server" ID="Corridor_max_Number" Text='<%# Bind("maxquantity") %>'></asp:TextBox>
                            <asp:RangeValidator runat="server" Type="Integer"
                                MinimumValue="0" MaximumValue="9999" ControlToValidate="Corridor_max_Number" ForeColor="Red"
                                ErrorMessage="Integer number between 1 and 9999" />
                        </EditItemTemplate>
                    </asp:TemplateField>

                    <asp:CheckBoxField DataField="is_active" HeaderText="Is Active" ItemStyle-Width="15%" SortExpression="is_active">
                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" />
                        <ItemStyle HorizontalAlign="Center" VerticalAlign="Middle" />
                    </asp:CheckBoxField>

                </Columns>

                <FooterStyle BackColor="White" ForeColor="#000066" />
                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                <RowStyle ForeColor="#000066" />
                <SelectedRowStyle CssClass="RowSelected" />
                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                <SortedAscendingHeaderStyle BackColor="#007DBB" />
                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                <SortedDescendingHeaderStyle BackColor="#00547E" />

            </asp:GridView>

            <asp:ObjectDataSource ID="CorridorsDataSource" runat="server" SelectMethod="get_floor_corridors" TypeName="FrontEnd.Zpages.Manage_Buildings" UpdateMethod="update_corridor_satatus" DataObjectTypeName="FrontEnd.Model.Building_Structuer.Corridor">
                <SelectParameters>
                    <asp:ControlParameter ControlID="Building_FloorsGridView" DefaultValue="-1" Name="floor_id" PropertyName="SelectedValue" Type="String" />
                </SelectParameters>
            </asp:ObjectDataSource>

            <br />
            <table style="width: 100%">
                <tr>
                    <td>
                        <asp:Panel ID="Panel2" runat="server" DefaultButton="add_corridor_but" CssClass="LableMargin_left" Width="80%" HorizontalAlign="Center" EnableViewState="true">
                            <table>
                                <tr>
                                    <td>
                                        <asp:Label runat="server" Width="200px" Text="Corridor Number">
                                        </asp:Label>
                                    </td>

                                    <td>
                                        <asp:TextBox runat="server" ID="corridor_number_textbox" Width="200px" ValidationGroup="Add_c"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:Label ID="Label4" Text="" runat="server" Width="100px"></asp:Label>

                                    </td>
                                    <td>
                                        <asp:Button ID="add_corridor_but" runat="server" UseSubmitBehavior="true" Width="100px"
                                            Text="Add" ValidationGroup="Add_c" OnClick="add_corridor_but_Click" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" Display="Dynamic" runat="server"
                                            ErrorMessage="Corridor Number is Required!" ForeColor="Red" ControlToValidate="corridor_number_textbox" ValidationGroup="Add_c"></asp:RequiredFieldValidator>
                                        <asp:CompareValidator runat="server" Operator="DataTypeCheck" Type="Integer" ForeColor="Red" ValidationGroup="Add_c"
                                            ControlToValidate="corridor_number_textbox"
                                            ErrorMessage="  Value must be Number !">
                                        </asp:CompareValidator>
                                    </td>
                                    <td></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
    <br />
    <br />
    <asp:Panel runat="server" GroupingText="Corridor Rooms" Font-Bold="true">
        <div style="width: 100%; padding-top: 10px;">
            <asp:Label runat="server" ID="add_room_message" ForeColor="Red" BorderStyle="None" CssClass="LableMargin_left" HorizontalAlign="Center" Width="80%"></asp:Label>
            <asp:GridView ID="rooms_GridView" runat="server" AutoGenerateColumns="False" CellPadding="3" DataKeyNames="id"
                HorizontalAlign="Center" Width="80%" AutoGenerateSelectButton="True" AutoGenerateEditButton="True" EmptyDataText="Sorry, no data available." ShowHeaderWhenEmpty="True" BackColor="White"
                BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px" DataSourceID="RoomsDataSource" OnSelectedIndexChanged="buildings_GridView_SelectedIndexChanged">
                <Columns>
                    <asp:BoundField DataField="id" HeaderText="id" InsertVisible="False" SortExpression="id" Visible="False" />
                    <asp:TemplateField HeaderText="Room Number" ItemStyle-Width="18%" SortExpression="control_name">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Room_Number" Text='<%# Eval("number") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Room Type" ItemStyle-Width="18%">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Room_type" Text='<%# Eval("type") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>

                    <asp:TemplateField HeaderText="Room Name" ItemStyle-Width="18%">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Room_Name" Text='<%# Eval("name") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Max Capacity" ItemStyle-Width="18%">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Room_max_Number" Text='<%# Eval("maxquantity") %>'></asp:Literal>
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox runat="server" ID="Room_max_Number" Text='<%# Bind("maxquantity") %>'></asp:TextBox>
                            <asp:RangeValidator runat="server" Type="Integer"
                                MinimumValue="0" MaximumValue="9999" ControlToValidate="Room_max_Number" ForeColor="Red"
                                ErrorMessage="Integer number between 1 and 9999" />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:CheckBoxField DataField="is_active" HeaderText="Is Active" ItemStyle-Width="15%" SortExpression="is_active">
                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" />
                        <ItemStyle HorizontalAlign="Center" VerticalAlign="Middle" />
                    </asp:CheckBoxField>
                </Columns>

                <FooterStyle BackColor="White" ForeColor="#000066" />
                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                <RowStyle ForeColor="#000066" />
                <SelectedRowStyle CssClass="RowSelected" />
                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                <SortedAscendingHeaderStyle BackColor="#007DBB" />
                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                <SortedDescendingHeaderStyle BackColor="#00547E" />

            </asp:GridView>

            <asp:ObjectDataSource ID="RoomsDataSource" runat="server" SelectMethod="get_corridor_rooms" TypeName="FrontEnd.Zpages.Manage_Buildings" UpdateMethod="update_room_satatus" DataObjectTypeName="FrontEnd.Model.Building_Structuer.Room">
                <SelectParameters>
                    <asp:ControlParameter ControlID="corridors_GridView" DefaultValue="-1" Name="corridor_id" PropertyName="SelectedValue" Type="String" />
                </SelectParameters>
            </asp:ObjectDataSource>

            <br />
            <table style="width: 100%">
                <tr>
                    <td>
                        <asp:Panel ID="Panel3" runat="server" DefaultButton="add_room_but" CssClass="LableMargin_left" Width="80%" HorizontalAlign="Center" EnableViewState="true">
                            <table>
                                <tr>
                                    <td>
                                        <asp:Label runat="server" Width="200px" Text="Room Number">
                                        </asp:Label>
                                    </td>

                                    <td>
                                        <asp:TextBox runat="server" ID="add_room_textbox" Width="200px" ValidationGroup="Add_r"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:Label ID="Label2" Text="" runat="server" Width="50px"></asp:Label>
                                        <asp:CheckBox ID="Is_Entrance" Text="Entrance Room?" runat="server"></asp:CheckBox>
                                        <asp:Label ID="Label3" Text="" runat="server" Width="50px"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:Button ID="add_room_but" runat="server" UseSubmitBehavior="true" Width="100px"
                                            Text="Add" ValidationGroup="Add_r" OnClick="add_room_but_Click" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" Display="Dynamic" runat="server"
                                            ErrorMessage="Room Number is Required!" ForeColor="Red" ControlToValidate="add_room_textbox" ValidationGroup="Add_r"></asp:RequiredFieldValidator>
                                        <asp:CompareValidator runat="server" Operator="DataTypeCheck" Type="Integer" ForeColor="Red" ValidationGroup="Add_r"
                                            ControlToValidate="add_room_textbox"
                                            ErrorMessage="  Value must be Number !">
                                        </asp:CompareValidator>
                                    </td>
                                    <td></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
    <br />
    <br />
    <asp:Panel runat="server" GroupingText="Corridor Links" Font-Bold="true">
        <div style="width: 100%; padding-top: 10px;">
            <asp:Label runat="server" ID="add_corridor_link_message" ForeColor="Red" CssClass="LableMargin_left" BorderStyle="None" HorizontalAlign="Center" Width="80%"></asp:Label>
            <asp:GridView ID="corridor_links_GridView" runat="server" AutoGenerateColumns="False" CellPadding="3" DataKeyNames="id"
                HorizontalAlign="Center" Width="80%" AutoGenerateSelectButton="True" EmptyDataText="Sorry, no data available." ShowHeaderWhenEmpty="True" BackColor="White"
                BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px" OnSelectedIndexChanged="buildings_GridView_SelectedIndexChanged" DataSourceID="CorridorLinksDataSource">
                <Columns>
                    <asp:BoundField DataField="id" HeaderText="id" InsertVisible="False" SortExpression="id" Visible="False" />
                    <asp:TemplateField HeaderText="Corridor Number" ItemStyle-Width="40%" SortExpression="control_name">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Corridor_Number" Text='<%# Eval("number") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Corridor Name" ItemStyle-Width="40%" SortExpression="control_name">
                        <ItemTemplate>
                            <asp:Literal runat="server" ID="Corridor_Name" Text='<%# Eval("name") %>'></asp:Literal>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>

                <FooterStyle BackColor="White" ForeColor="#000066" />
                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                <RowStyle ForeColor="#000066" />
                <SelectedRowStyle CssClass="RowSelected" />
                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                <SortedAscendingHeaderStyle BackColor="#007DBB" />
                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                <SortedDescendingHeaderStyle BackColor="#00547E" />

            </asp:GridView>

            <br />
            <table style="width: 100%">
                <tr>
                    <td>
                        <asp:Panel ID="Panel4" runat="server" DefaultButton="add_room_but" CssClass="LableMargin_left" Width="80%" HorizontalAlign="Center" EnableViewState="true">
                            <table>
                                <tr>
                                    <td>
                                        <asp:Label runat="server" Width="200px" Text="Corridor Number">
                                        </asp:Label>
                                    </td>

                                    <td>
                                        <asp:DropDownList runat="server" ID="add_corridor_link_ddl" Width="200px" ValidationGroup="Add_cl" DataSourceID="AllCorridorDataSource" DataTextField="name" DataValueField="id"></asp:DropDownList>
                                        <asp:ObjectDataSource ID="AllCorridorDataSource" runat="server" SelectMethod="get_building_corridors" TypeName="FrontEnd.Control.ServerData">
                                            <SelectParameters>
                                                <asp:ControlParameter ControlID="buildings_GridView" DefaultValue="-1" Name="building_id" PropertyName="SelectedValue" Type="String" />
                                                <asp:ControlParameter ControlID="corridors_GridView" DefaultValue="-1" Name="corridor_id" PropertyName="SelectedValue" Type="String" />
                                                <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                                            </SelectParameters>
                                        </asp:ObjectDataSource>
                                        <asp:ObjectDataSource ID="CorridorLinksDataSource" runat="server" SelectMethod="get_corridor_links" TypeName="FrontEnd.Control.ServerData">
                                            <SelectParameters>
                                                <asp:ControlParameter ControlID="corridors_GridView" DefaultValue="-1" Name="corridor_id" PropertyName="SelectedValue" Type="String" />
                                                <asp:SessionParameter DefaultValue="-1" Name="accessToken" SessionField="__AccessToken" Type="String" />
                                            </SelectParameters>
                                        </asp:ObjectDataSource>
                                    </td>
                                    <td>
                                        <asp:Label ID="Label5" Text="" runat="server" Width="100px"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:Button ID="add_corridor_link_but" runat="server" UseSubmitBehavior="true" Width="100px"
                                            Text="Add" ValidationGroup="Add_cl" OnClick="add_corridor_link_but_Click" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <%--                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" Display="Dynamic" runat="server"
                                            ErrorMessage="Room Number is Required!" ForeColor="Red" ControlToValidate="add_room_textbox" ValidationGroup="Add_r"></asp:RequiredFieldValidator>
                                        <asp:CompareValidator runat="server" Operator="DataTypeCheck" Type="Integer" ForeColor="Red" ValidationGroup="Add_r"
                                            ControlToValidate="add_room_textbox"
                                            ErrorMessage="  Value must be Number !">
                                        </asp:CompareValidator>--%>
                                    </td>
                                    <td></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
</asp:Content>
