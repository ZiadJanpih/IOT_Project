using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Collections.Specialized;
using FrontEnd.Model.Building_Structuer;
using System.Text;
using System.Web.Script.Serialization;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using FrontEnd.Model.Accounts;
using FrontEnd.Model.Reports;

namespace FrontEnd.Control
{
    public class ServerData
    {

        public static List<Building> get_buildings(string accessToken)
        {
            List<Building> buildings = new List<Building>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers["Authorization"] = accessToken;
                    var response = wb.DownloadString(Handler.server_address + "/getBuildings");
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_buildings = json.data as JArray;
                        dynamic d_buildings = json_buildings;
                        foreach (dynamic d_building in d_buildings)
                        {
                            Building building = new Building();
                            building.id = d_building.id;
                            building.name = d_building.name;
                            buildings.Add(building);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return buildings;
        }

        public static string add_buildings(string name, string accessToken)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/addBuilding");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    name = name
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return null;
        }


        public static List<Floor> get_building_floors(string building_id, string accessToken)
        {
            List<Floor> building_floors = new List<Floor>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getFloors?BuildingId=" + building_id);
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_building_floors = json.data as JArray;
                        dynamic d_building_floors = json_building_floors;
                        foreach (dynamic d_floor in d_building_floors)
                        {
                            Floor floor = new Floor();
                            floor.id = d_floor.id;
                            floor.name = "F" + d_floor.number;
                            floor.number = d_floor.number;
                            building_floors.Add(floor);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return building_floors;
        }



        public static List<Floor> get_building_floors_dll(string building_id, string accessToken)
        {
            List<Floor> building_floors = new List<Floor>();
            Floor floor = new Floor();
            floor.id = "0";
            floor.name = "All";
            floor.number = 0;
            building_floors.Add(floor);
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getFloors?BuildingId=" + building_id);
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_building_floors = json.data as JArray;
                        dynamic d_building_floors = json_building_floors;
                        foreach (dynamic d_floor in d_building_floors)
                        {
                            floor = new Floor();
                            floor.id = d_floor.id;
                            floor.name = "F" + d_floor.number;
                            floor.number = d_floor.number;
                            building_floors.Add(floor);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return building_floors;
        }


        public static string add_building_floor(string building_id, int number, string accessToken)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/addFloor");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    buildingId = building_id,
                    floorNumber = number
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return null;
        }


        public static List<Corridor> get_floor_corridors(string floor_id, string accessToken)
        {
            List<Corridor> floor_corridors = new List<Corridor>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getCorridors?FloorId=" + floor_id);
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_floor_corridors = json.data as JArray;
                        dynamic d_floor_corridors = json_floor_corridors;
                        foreach (dynamic d_corridor in d_floor_corridors)
                        {
                            Corridor corridor = new Corridor();
                            corridor.id = d_corridor.id;
                            corridor.number = d_corridor.number;
                            corridor.type = "C";
                            corridor.name = d_corridor.name;
                            corridor.is_active = d_corridor.isactive;
                            corridor.maxquantity = d_corridor.maxquantity;
                            floor_corridors.Add(corridor);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return floor_corridors;
        }

        public static List<Corridor> get_all_corridors(string corridor_id, string accessToken)
        {
            List<Corridor> all_corridors = new List<Corridor>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getCorridors");
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_floor_corridors = json.data as JArray;
                        dynamic d_floor_corridors = json_floor_corridors;
                        foreach (dynamic d_corridor in d_floor_corridors)
                        {
                            Corridor corridor = new Corridor();
                            corridor.id = d_corridor.id;
                            corridor.number = d_corridor.number;
                            corridor.type = "C";
                            corridor.is_active = d_corridor.isactive;
                            corridor.name = d_corridor.name;
                            corridor.maxquantity = d_corridor.maxquantity;
                            if (!corridor.id.Equals(corridor_id))
                                all_corridors.Add(corridor);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return all_corridors;
        }

        public static List<Corridor> get_building_corridors(string building_id,string corridor_id, string accessToken)
        {
            List<Corridor> all_corridors = new List<Corridor>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getBuildingCorridors?BuildingId=" + building_id);
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_floor_corridors = json.data as JArray;
                        dynamic d_floor_corridors = json_floor_corridors;
                        foreach (dynamic d_corridor in d_floor_corridors)
                        {
                            Corridor corridor = new Corridor();
                            corridor.id = d_corridor.id;
                            corridor.number = d_corridor.number;
                            corridor.type = "C";
                            corridor.is_active = d_corridor.isactive;
                            corridor.name = d_corridor.name;
                            corridor.maxquantity = d_corridor.maxquantity;
                            if (!corridor.id.Equals(corridor_id))
                                all_corridors.Add(corridor);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return all_corridors;
        }
        public static string add_floor_corridor(string floorId, int corridorNumber, string accessToken)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/addCorridor");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    floorId = floorId,
                    corridorNumber = corridorNumber
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return null;
        }

        public static List<Floor_part> get_floor_parts(string floor_id, string accessToken)
        {
            List<Floor_part> floor_Parts = new List<Floor_part>();
            Floor_part fp = new Floor_part();
            fp.id = "0";
            fp.name="All";
            floor_Parts.Add(fp);
            List<Corridor> corridors = get_floor_corridors(floor_id, accessToken);
            if (corridors != null)
            {
                floor_Parts.AddRange(corridors);
                foreach (Corridor c in corridors)
                {
                    List<Room> corridor_rooms = get_corridor_rooms(c.id, accessToken);
                    if (corridor_rooms != null)
                        floor_Parts.AddRange(corridor_rooms);
                }
            }

            return floor_Parts;
        }

        public static List<Room> get_corridor_rooms(string corridor_id, string accessToken)
        {
            List<Room> corridor_rooms = new List<Room>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getRooms?CorridorId=" + corridor_id);
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_corridor_rooms = json.data as JArray;
                        dynamic d_corridor_rooms = json_corridor_rooms;
                        foreach (dynamic d_room in d_corridor_rooms)
                        {
                            Room room = new Room();
                            room.id = d_room.id;
                            room.number = d_room.roomnumber;
                            room.type = d_room.roomtype;
                            room.is_active = d_room.isactive;
                            room.maxquantity = d_room.maxquantity;
                            room.name = d_room.name;
                            corridor_rooms.Add(room);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return corridor_rooms;
        }

        public static string add_corridor_room(string corridorId, int roomNumber, bool is_entrance, string accessToken)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/addRoom");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    corridorId = corridorId,
                    roomNumber = roomNumber,

                    isRoom = is_entrance ? 0 : 1
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return null;
        }

        public static List<Corridor> get_corridor_links(string corridor_id, string accessToken)
        {
            List<Corridor> linked_corridors = new List<Corridor>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getCorridorConnections?CorridorId=" + corridor_id);
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_floor_corridors = json.data as JArray;
                        dynamic d_floor_corridors = json_floor_corridors;
                        foreach (dynamic d_corridor in d_floor_corridors)
                        {
                            Corridor corridor = new Corridor();
                            corridor.id = d_corridor.id;
                            corridor.number = d_corridor.number;
                            corridor.type = "C";
                            corridor.name = d_corridor.name;
                            //   if (!corridor.id.Equals(corridor_id))                      
                            linked_corridors.Add(corridor);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return linked_corridors;
        }

        public static string add_corridor_link(string corridor1_id, string corridor2_id, string accessToken)
        {
            List<Corridor> linked_corridors1 = get_corridor_links(corridor1_id, accessToken);
            List<Corridor> linked_corridors2 = get_corridor_links(corridor2_id, accessToken);
            bool is_exist = false;
            for (int i = 0; i < linked_corridors1.Count && !is_exist; i++)
            {
                if (linked_corridors1.ElementAt(i).id.Equals(corridor2_id))
                    return "This Link is already added";
            }
            for (int i = 0; i < linked_corridors2.Count && !is_exist; i++)
            {
                if (linked_corridors2.ElementAt(i).id.Equals(corridor1_id))
                    return "This Link is already added";
            }

            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/addCorridorConnection");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    fromCorridor = corridor1_id,
                    toCorridor = corridor2_id
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return "";
        }



        public static string checkSensor(string sensorEntityId, int NumberOfCurrentUsers, string[] macAddresses, string accessToken)
        {
            //if(NumberOfCurrentUsers >0)
            {
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/checkSensor");
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";
                httpWebRequest.Headers.Add("Authorization", accessToken);
                string data = "";
                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    string json = new JavaScriptSerializer().Serialize(new
                    {
                        sensorEntityId = sensorEntityId,
                        NumberOfCurrentUsers = NumberOfCurrentUsers,
                        macAddresses = macAddresses
                    });
                    streamWriter.Write(json);
                    data = json;
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                }
            }
            return "";
        }

        public static string Login(string u, string p, ref Admin_user a_user)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/adminLogin");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    username = u,
                    password = p
                });
                streamWriter.Write(json);
            }
            string res = null;
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                try
                {
                    dynamic json = JValue.Parse(result);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        dynamic json_Auser = json.data;
                        a_user = new Admin_user();
                        a_user.username = json_Auser.username;
                        a_user.accessToken = json_Auser.accessToken;
                        a_user.refreshToken = json_Auser.refreshToken;

                    }
                    res = json.message;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return res;
        }

        public static string update_room_status(string id, int Room_Number, string Room_type, int maxquantity, bool is_active, string accessToken)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/changeRoomStatus");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    roomid = id,
                    status = is_active ? 1 : 0,
                    maxquantity = maxquantity
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return null;
        }

        public static string update_corridor_status(string id, int Corridor_Number, int maxquantity, bool is_active, string accessToken)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/changeCorridorStatus");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    corridorId = id,
                    status = is_active ? 1 : 0,
                    maxquantity = maxquantity
                });
                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }
            return null;
        }

        public static List<string> get_all_devices(string accessToken)
        {
            List<string> devices = new List<string>();
            using (var wb = new WebClient())
            {
                try
                {
                    wb.Headers.Add("Authorization", accessToken);
                    var response = wb.DownloadString(Handler.server_address + "/getUsersDevices");
                    dynamic json = JValue.Parse(response);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_devices = json.data as JArray;
                        dynamic d_devices = json_devices;
                        foreach (dynamic d_device in d_devices)
                        {
                            string s = d_device.deviceid;
                            devices.Add(s);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return devices;
        }

        public static List<Room> get_rooms_data(string building_id, string accessToken)
        {
            List<Room> rooms = new List<Room>();
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/getRCReport");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    buildingId = building_id
                });
                streamWriter.Write(json);
            }
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                try
                {
                    dynamic json = JValue.Parse(result);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_rooms = json.data as JArray;
                        dynamic d_rooms = json_rooms;
                        foreach (dynamic d_room in d_rooms)
                        {
                            Room room = new Room();

                            room.id = Convert.ToString(d_room.id);
                            room.number = Convert.ToInt32(d_room.number);
                            room.name = Convert.ToString(d_room.name);
                            room.p_count = Convert.ToInt32(d_room.currentquantity);
                            room.maxquantity = Convert.ToInt32(d_room.maxquantity);
                            rooms.Add(room);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return rooms;
        }


        public static List<Dashbord_count_h> get_building_count_h(string building_id, string accessToken)
        {
            List<Dashbord_count_h> counts = new List<Dashbord_count_h>();
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/getDWReport");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string date = DateTime.Now.ToString("yyyy-MM-dd");
                string json = new JavaScriptSerializer().Serialize(new
                {
                    buildingId = building_id,
                    date = date
                });
                streamWriter.Write(json);
            }
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                try
                {
                    dynamic json = JValue.Parse(result);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_counts = json.data as JArray;
                        dynamic d_counts = json_counts;
                        foreach (dynamic d_count in d_counts)
                        {
                            Dashbord_count_h count = new Dashbord_count_h();

                            count.id = Convert.ToString(d_count.id);
                            count.date = Convert.ToString(d_count.date);
                            count.value = Convert.ToInt32(d_count.value);

                            counts.Add(count);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return counts;
        }



        public static List<Statistics_avg> get_statistics_avg(string entityId, string type, string aggregationType, string fromDate, string toDate, string accessToken)
        {
            List<Statistics_avg> avgs = new List<Statistics_avg>();
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/avgPerHourReport");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    entityId = entityId,
                    type = type,
                    aggregationType = aggregationType,
                    fromDate = fromDate,
                    toDate = toDate

                });
                streamWriter.Write(json);
            }
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                try
                {
                    dynamic json = JValue.Parse(result);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_avgs = json.data as JArray;
                        dynamic d_avgs = json_avgs;
                        foreach (dynamic d_avg in d_avgs)
                        {
                            Statistics_avg avg = new Statistics_avg();

                            avg.id = Convert.ToString(d_avg.id);
                            avg.name = Convert.ToString(d_avg.name);
                            avg.date = Convert.ToString(d_avg.date);
                            avg.value = Decimal.Round(Convert.ToDecimal(d_avg.avg), 2);

                            avgs.Add(avg);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return avgs;
        }




        public static List<Statistics_main_max> get_statistics_MinMax(string entityId, string type,string aggregationType, string fromDate, string toDate, string accessToken)
        {
            List<Statistics_main_max> min_maxs = new List<Statistics_main_max>();
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Handler.server_address + "/minMaxReport");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add("Authorization", accessToken);
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    entityId = entityId,
                    type = type,
                    aggregationType= aggregationType,
                    fromDate = fromDate,
                    toDate = toDate

                });
                streamWriter.Write(json);
            }
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                try
                {
                    dynamic json = JValue.Parse(result);
                    string message = json.message;
                    if (message.Equals("Operation Success"))
                    {
                        JArray json_values = json.data as JArray;
                        dynamic d_values = json_values;
                        foreach (dynamic d_value in d_values)
                        {
                            Statistics_main_max min_max = new Statistics_main_max();

                            min_max.id = Convert.ToString(d_value.id);
                            min_max.name = Convert.ToString(d_value.name);
                            min_max.date = Convert.ToString(d_value.date);
                            min_max.min = Convert.ToInt32(d_value.minimum);
                            min_max.max = Convert.ToInt32(d_value.maximum);

                            min_maxs.Add(min_max);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return min_maxs;
        }

    }
}