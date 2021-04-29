using FrontEnd.Control;
using FrontEnd.Model.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontEnd.Model.Building_Structuer
{
    
    public class Handler
    {
        public static string server_address = "http://localhost:3000";
        public static Building_Graph bg;
        public static List<User_device> users = new List<User_device>();
        public static List<BLE_scanner> scanners = new List<BLE_scanner>();
    }
}