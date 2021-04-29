using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontEnd.Model.Accounts
{
    public class Admin_user
    {
        public string username { set; get; }
        public string accessToken { set; get; }
        public string refreshToken{ set; get; }
}
}