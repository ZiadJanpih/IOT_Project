<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="FrontEnd.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title><%: Page.Title %> Screen-In</title>
    <link rel="shortcut icon" type="image/x-icon" href="~/images/icon.png" />
    <link rel="stylesheet" href="~/styles/login.css"/> 
</head>
<body>

    <table>
        <tr>
            <td class ="logo">Screen<img src="../images/logo.png" style=" width:100px; height:100px"/>In
            </td>

            <td>
                    <%--    //<h1 class ="logo">Screen-In</h1>--%>
                    <div class="login">
        

        <h1 class="loginh1">Login</h1>
        <form id="form1" runat="server">
            <asp:TextBox ID="u_text" runat="server" CssClass="text_input" placeholder="Username" required="required"></asp:TextBox>
            <asp:TextBox ID="p_text" runat="server"  CssClass="text_input" placeholder="Password" TextMode="Password" required="required"></asp:TextBox>
            <asp:Button ID="login_but" runat="server" Text="Login" CssClass="btn btn-primary btn-block btn-large"  OnClick="login_but_Click"/>
            <asp:Label runat="server" ID="login_message" ForeColor="Red"   BorderStyle="None" HorizontalAlign="Center"></asp:Label>
        </form>
    </div>
            </td>
            <td>

            </td>
        </tr>
        
    </table>
    

</body>
</html>
