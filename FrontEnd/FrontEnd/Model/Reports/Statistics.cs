using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Web;

namespace FrontEnd.Model.Reports
{
    public class Statistics_avg
    {
        [JsonInclude]
        public string id { set; get; }
        [JsonInclude]
        public string name { set; get; }
        [JsonInclude]
        public string date { set; get; }
        [JsonInclude]
        public Decimal value { set; get; }
    }

    public class Statistics_main_max
    {
        [JsonInclude]
        public string id { set; get; }
        [JsonInclude]
        public string name { set; get; }
        [JsonInclude]
        public string date { set; get; }
        [JsonInclude]
        public int min { set; get; }
        [JsonInclude]
        public int max { set; get; }


    }
}