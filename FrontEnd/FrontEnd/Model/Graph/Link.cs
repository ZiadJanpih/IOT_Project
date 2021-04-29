using FrontEnd.Model.Building_Structuer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.Json.Serialization;

namespace FrontEnd.Model.Graph
{
    public class Link
    {
        [JsonInclude]
        public Floor_part vertexA;
        [JsonInclude]
        public Floor_part vertexB;

        public Link()
        {

        }
        public Link (Floor_part a, Floor_part b)
        {
            this.vertexA = a;
            this.vertexB = b;
        }
    }
}