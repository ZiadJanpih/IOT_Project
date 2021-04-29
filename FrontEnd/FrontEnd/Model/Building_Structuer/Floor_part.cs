using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FrontEnd.Model.Building_Structuer
{
    public class Floor_part
    {
        [JsonInclude]
        public string id { set; get; }
        [JsonInclude]
        public int number { set; get; }
        [JsonInclude]
        public int p_count { set; get; }
        [JsonInclude]
        public string type { set; get; }
        [JsonInclude]
        public string name { set; get; }
        [JsonInclude]
        public bool is_active { set; get; }

        [JsonInclude]
        public int maxquantity { set; get; }
    }

}