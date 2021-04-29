using FrontEnd.Control;
using FrontEnd.Model.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FrontEnd.Zpages
{
    public partial class Statistics : System.Web.UI.Page
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
        public static Statistics_avg[] get_statistic_avg(string entityId, string type, string aggregationType, string fromDate, string toDate)
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            Statistics_avg[] res = ServerData.get_statistics_avg(entityId,type,aggregationType,fromDate,toDate, accessToken).ToArray();
            return res;
        }


        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static Statistics_main_max[] get_statistic_MainMax(string entityId, string type,string aggregationType, string fromDate, string toDate)
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            Statistics_main_max[] res = ServerData.get_statistics_MinMax(entityId, type, aggregationType, fromDate, toDate, accessToken).ToArray();
            return res;
        }

        protected void buildings_ddl_SelectedIndexChanged(object sender, EventArgs e)
        {
            floors_ddl.DataBind();
            rooms_ddl.DataBind();
        }

        protected void floors_ddl_SelectedIndexChanged(object sender, EventArgs e)
        {
            rooms_ddl.DataBind();
        }
    }
}