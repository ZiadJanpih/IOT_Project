using FrontEnd.Model.Building_Structuer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace FrontEnd.Control
{
    public class BLE_scanner
    {
        public Floor_part room;
        int scan_interval;
        bool is_live;
        List<User_device> users;
        Thread thread;
        string accessToken;
        public BLE_scanner(Floor_part room, int scan_interval, List<User_device> users, string accessToken)
        {
            this.thread = new Thread(run);
            this.room = room;
            this.scan_interval = scan_interval;
            this.users = users;
            is_live = false;
            this.accessToken = accessToken;
        }
        public void start()
        {
            is_live = true;
            this.thread.Start();
        }
        public void stop()
        {
            this.thread.Abort();
        }
        private void run()
        {
            while (is_live)
            {
                int p_count = 0;
                List<string> macAddresses = new List<string>();
                try
                {
                    foreach (User_device u in users)
                    {

                        if (u.is_started && u.current_position!=null && u.current_position.id == room.id && u.is_live)
                        {

                            macAddresses.Add(u.device_id);
                            p_count++;
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("BLE_scanner Exception : "+e.Message);
                }

                ServerData.checkSensor(this.room.id, p_count, macAddresses.ToArray(), this.accessToken);
                room.p_count = p_count;
                Thread.Sleep(scan_interval);
            }

        }

    }
}