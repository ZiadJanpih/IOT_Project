using FrontEnd.Control;
using FrontEnd.Model.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontEnd.Model.Building_Structuer
{
    public class Building
    {
        public string id { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public bool isactive { get; set; }
        public List<Floor> building_floors { get; set; }
        public Building_Graph building_Graph { get; set; }

        private void generate_data2()
        {
            this.id = "id";
            this.name = "Building1";
            this.building_floors = new List<Floor>();
            for (int f = 0; f < 2; f++)
            {
                Floor floor = new Floor();
                floor.id = "B1F" + f;
                floor.number = f;
                floor.floor_corridors = new List<Corridor>();
                for(int c= 0 ; c < 2; c++)
                {
                    Corridor corridor = new Corridor();
                    corridor.id = "F" + f + "C" + c ;
                    corridor.number = c;
                    corridor.name = corridor.id;
                    corridor.type = "C";
                    corridor.corridor_links = new List<Corridor>();
                    corridor.corridor_rooms = new List<Room>();
                    if (c==0 && f==0)
                    {
                        Room room = new Room();
                        room.id = "F" + f + "C" + c + "E1";
                        room.number = 1;
                        room.name = room.id;
                        room.type = "E";
                        corridor.corridor_rooms.Add(room);
                    }
                    for (int r = 1; r <= 4; r++)
                    {
                        Room room = new Room();
                        room.id = "F"+f+"C"+c+"R"+r;
                        room.number = r;
                        room.name = room.id;
                        room.type = "R";
                        corridor.corridor_rooms.Add(room);
                    }
                    floor.floor_corridors.Add(corridor);
                }
                this.building_floors.Add(floor);
            }
            this.building_floors.ElementAt(0).floor_corridors.ElementAt(0).corridor_links.Add(building_floors.ElementAt(0).floor_corridors.ElementAt(1));
            this.building_floors.ElementAt(0).floor_corridors.ElementAt(0).corridor_links.Add(building_floors.ElementAt(1).floor_corridors.ElementAt(0));
            this.building_floors.ElementAt(1).floor_corridors.ElementAt(1).corridor_links.Add(building_floors.ElementAt(0).floor_corridors.ElementAt(1));
            this.building_floors.ElementAt(1).floor_corridors.ElementAt(1).corridor_links.Add(building_floors.ElementAt(1).floor_corridors.ElementAt(0));
        }


        private void generate_data(string id,string name,string accessToken)
        {
            this.id = id;
            this.name = name;
            this.building_floors = ServerData.get_building_floors(id, accessToken);
            foreach(Floor f in this.building_floors)
            {
                f.floor_corridors = ServerData.get_floor_corridors(f.id, accessToken);
                foreach(Corridor c in f.floor_corridors)
                {
                    c.name = "F" + f.number + "C" + c.number;
                    c.type = "C";
                    c.corridor_links = ServerData.get_corridor_links(c.id, accessToken);
                    c.corridor_rooms = ServerData.get_corridor_rooms(c.id, accessToken);
                    foreach(Room r in c.corridor_rooms)
                    {                      
                        r.type =r.type.Equals("Entrance") ? "E":"R";
                        r.name = c.name + r.type+r.number;
                    }
                }
            }
        }
        public Building_Graph get_building_graph(string id, string name, string accessToken)
        {
            generate_data(id,name,accessToken);
            building_Graph = new Building_Graph();           
            building_Graph.vertics = new List<Floor_part>();
            building_Graph.links = new List<Link>();
            foreach (Floor f in this.building_floors)
            {
                foreach(Corridor c in f.floor_corridors)
                {
                    building_Graph.vertics.Add(c);
                    foreach(Room r in c.corridor_rooms)
                    {
                        building_Graph.vertics.Add(r);
                        building_Graph.links.Add(new Link(c, r));
                    }
                    foreach(Corridor cc in c.corridor_links)
                    {
                        bool exist = false;
                        foreach (Link l in building_Graph.links)
                        {                          
                            if((l.vertexA==c && l.vertexB==cc)||(l.vertexA == cc && l.vertexB == c))
                            {
                                exist = true;
                            }
                        }
                        if (!exist)
                            building_Graph.links.Add(new Link(cc, c));
                    }
                }
            }
            int vertex_num = building_Graph.vertics.Count();
            building_Graph.adjacency_matrix = new int[vertex_num,vertex_num];
            int i = 0;
            foreach(Floor_part veri in building_Graph.vertics)
            {
                int j = 0;
                foreach (Floor_part verj in building_Graph.vertics)
                {
                    int exist = 0;
                    foreach (Link l in building_Graph.links)
                    {
                        if ((l.vertexA.id.Equals(veri.id) && l.vertexB.id.Equals(verj.id)) || (l.vertexA.id.Equals(verj.id) && l.vertexB.id.Equals(veri.id)))
                        {
                            exist = 1;
                        }
                    }
                    building_Graph.adjacency_matrix[i, j] = exist;
                    j++;
                }
                i++;
            }

            building_Graph.bg_json = Building_graph_json.get_Building_graph_json(building_Graph);
            return building_Graph;
        }
    }

}