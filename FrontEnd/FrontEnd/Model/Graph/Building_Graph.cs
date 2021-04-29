using FrontEnd.Model.Building_Structuer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Web.Script.Serialization;

namespace FrontEnd.Model.Graph
{
    public class Building_Graph
    {
        [JsonInclude]
        [JsonPropertyName("nodes")]
        public List<Floor_part> vertics;
        [JsonInclude]
        public List<Link> links;
        public int[,] adjacency_matrix;
        public Building_graph_json bg_json;

        public Building_Graph()
        {
            

        }

        public Building_graph_json get_json_graph( Building_Graph bg)
        {
            bg_json = Building_graph_json.get_Building_graph_json(bg);
            return bg_json;
        }
    } 
}

/*
              string json = "'{";
             json += "\"nodes\":[";
             for(int i=0;i<vertics.Count;i++)
             {
                if(i== vertics.Count-1)
                    json += "{\"id\":\"" + vertics[i].id + "\",\"type\":\"" + vertics[i].type + "\"}";
                else
                    json += "{\"id\":\"" + vertics[i].id + "\",\"type\":\"" + vertics[i].type + "\"},";
            }
             json += "], 'links':[";
            for (int i = 0; i < links.Count; i++)
            {
                if (i == links.Count-1)
                    json += "{\"source\":\"" + links[i].vertexA.id + "\",\"target\":\"" + links[i].vertexB.id + "\"}";
                else
                    json += "{\"source\":\"" + links[i].vertexA.id + "\",\"target\":\"" + links[i].vertexB.id + "\"},";
            }
            json += "]}'";
 
 
 
 
 
  */