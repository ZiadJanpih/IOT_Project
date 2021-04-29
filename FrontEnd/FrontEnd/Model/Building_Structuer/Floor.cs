using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontEnd.Model.Building_Structuer
{
    public class Floor
    {
        public string id { set; get; }
        public string name { set; get; }
        public int number { set; get; }
        public List<Corridor> floor_corridors { set; get; }

    }
}