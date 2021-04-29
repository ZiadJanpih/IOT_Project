using FrontEnd.Model.Building_Structuer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontEnd.Model.Graph
{
    public class Connection
    {
        public string source;
        public string target;
        public int value;
    }
    public class Building_graph_json
    {
        public Floor_part[] nodes;
        public Connection[] links;

        public static  Building_graph_json get_Building_graph_json(Building_Graph building_Graph)
        {
            Floor_part[] t_nodes = new Floor_part[building_Graph.vertics.Count];
            Connection[] t_links = new Connection[building_Graph.links.Count];


            for (int i = 0; i < building_Graph.links.Count; i++)
            {
                Connection c = new Connection();
                c.source = building_Graph.links.ElementAt(i).vertexA.id;
                c.target = building_Graph.links.ElementAt(i).vertexB.id;
                c.value = 2;
                t_links[i] = c;

            }

            for (int i = 0; i < building_Graph.vertics.Count; i++)
            {
                
                Floor_part n = new Floor_part();
                n.id = building_Graph.vertics.ElementAt(i).id;
                n.type = building_Graph.vertics.ElementAt(i).type;
                n.name= building_Graph.vertics.ElementAt(i).name;
                n.p_count = building_Graph.vertics.ElementAt(i).p_count; ;// building_Graph.vertics.ElementAt(i).p_count;
                t_nodes[i] = n;
                
            }
            Building_graph_json bg = new Building_graph_json();
            bg.links = t_links;
            bg.nodes = t_nodes;
            return bg;
        }
    }
}