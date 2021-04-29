using FrontEnd.Control;
using FrontEnd.Model.Building_Structuer;
using FrontEnd.Model.Graph;
using FrontEnd.Model.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FrontEnd
{
    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["__UserName"] == null)
            {
                Response.Redirect("~/login.aspx");
            }
           
                
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static Room[] get_rooms_data(string building_id)
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            Room[] res = ServerData.get_rooms_data(building_id, accessToken).ToArray();
            return res;
        }


        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static Dashbord_count_h[] get_dashbord_count_h(string building_id)
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            Dashbord_count_h[] res = ServerData.get_building_count_h(building_id, accessToken).ToArray();
            return res;
        }
    }
}