using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Web;

namespace FrontEnd.Model.Reports
{
    public class Dashbord_count_h
    {
        [JsonInclude]
        public string id { set; get; }
        [JsonInclude]
        public string date { set; get; }
        [JsonInclude]
        public int value { set; get; }
    }

}