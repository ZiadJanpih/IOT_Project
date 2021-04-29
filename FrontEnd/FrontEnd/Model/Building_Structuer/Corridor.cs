using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontEnd.Model.Building_Structuer
{
    public class Corridor : Floor_part
    {
        public List<Room> corridor_rooms;
        public List<Corridor> corridor_links;

    }
}