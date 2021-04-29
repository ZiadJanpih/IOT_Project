using FrontEnd.Model.Building_Structuer;
using FrontEnd.Model.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text.Json;
using System.Text.Json.Serialization;
using FrontEnd.Control;

namespace FrontEnd.Zpages
{
    public partial class Simulator3 : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["__UserName"] == null)
            {
                Response.Redirect("~/login.aspx");
            }
            if(!IsPostBack)
            {
               // sim_start.Visible = false;
               // sim_stop.Visible = false;
            }

            System.Diagnostics.Debug.WriteLine("Page_Load ");
        }
        [WebMethod]
        public static string Start_sim(int users_count, int scan_int,int Lecture_duration,int corridor_duration)
        {
             start_scaning(scan_int);
             move_devices(users_count, Lecture_duration, corridor_duration);
            return "";
        }


        [WebMethod]
        public static string stop_sim()
        {
            stop_move_devices();
            stop_scaning();
            return "";
        }


        [WebMethod]
        public static int get_users()
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            int count = ServerData.get_all_devices(accessToken).Count;
            return count;
        }

        [WebMethod]
        public static Building_graph_json Get_building_graph(string id, string name)
        {
            string accessToken= System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            Handler.bg = new Building().get_building_graph(id, name, accessToken);
            Handler.users = new List<User_device>();
            Handler.scanners = new List<BLE_scanner>();
            return Handler.bg.get_json_graph(Handler.bg);
        }

        [WebMethod]
        public static Building_graph_json Get_building_graph2()
        {
            return Handler.bg.get_json_graph(Handler.bg);
        }

        public static void move_devices(int users_count, int Lecture_duration, int corridor_duration)
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            List<string> devices = ServerData.get_all_devices(accessToken);
            int count = devices.Count;

            for (int i = 0; i < users_count; i++)
            {              
                User_device user = new User_device(Handler.bg);
                user.id = devices.ElementAt(i);
                user.user_id = user.id;
                user.device_id = user.id;
                User_device.corridor_time = corridor_duration * 1000;
                User_device.lecture_time = Lecture_duration * 1000;
                user.start();
                Handler.users.Add(user);
            }
            
        }


        public static void stop_move_devices()
        {
            
            foreach (User_device d in Handler.users)
            {
                d.stop();
                
            }
            Handler.users.Clear();
        }

        public static void stop_scaning()
        {
            
            foreach (BLE_scanner s in Handler.scanners)
            {
                s.stop();
            }
            Handler.scanners.Clear();

        }

        public static void start_scaning(int scan_int)
        {
            string accessToken = System.Web.HttpContext.Current.Session["__AccessToken"].ToString();
            foreach (Floor_part f in Handler.bg.vertics)
            {
                if(f.is_active)
                {
                    BLE_scanner scanner = new BLE_scanner(f, scan_int* 1000, Handler.users, accessToken);
                    scanner.start();
                    Handler.scanners.Add(scanner);
                }

            }

        }




    }
}