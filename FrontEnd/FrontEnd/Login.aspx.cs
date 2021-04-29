using FrontEnd.Control;
using FrontEnd.Model.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FrontEnd
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            login_message.Text = "";
            Session["__UserName"] = null;
            Session["__AccessToken"] = null;
            Session["__RefreshToken"] =null;
        }

        protected void login_but_Click(object sender, EventArgs e)
        {
            string u = u_text.Text;
            string p = p_text.Text;
            Admin_user user = null;
            string msg = ServerData.Login(u, p,ref user);
            if (msg== null)
            {
                login_message.Text = "Unknown problem happened";
                return;
            }
            if (msg.Equals("Operation Success"))
            {
                login_message.Text = "";
                Session["__UserName"] = user.username;
                Session["__AccessToken"] = "Bearer " + user.accessToken;
                Session["__RefreshToken"] =user.refreshToken;

                Response.Redirect("~/default.aspx");
            }
            else
            {
                login_message.Text = msg;
            }

        }
    }
}