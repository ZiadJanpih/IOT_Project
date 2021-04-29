using FrontEnd.Control;
using FrontEnd.Model.Building_Structuer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FrontEnd.Zpages
{
    public partial class Manage_Buildings : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["__UserName"] == null)
            {
                Response.Redirect("~/login.aspx");
            }
        }

        protected void add_Click(object sender, EventArgs e)
        {


            string building_name = BuildingNameTextBox.Text;
            ServerData.add_buildings(building_name, Session["__AccessToken"].ToString());
            buildings_GridView.DataBind();
        }

        protected void add_floor_but_Click(object sender, EventArgs e)
        {
            if (buildings_GridView.SelectedValue!= null)
            {
                int floor_number = int.Parse(add_floor_TextBox.Text);
                string building_id = buildings_GridView.SelectedValue.ToString();
                ServerData.add_building_floor(building_id, floor_number, Session["__AccessToken"].ToString());
                add_floor_message.Text = "";
                Building_FloorsGridView.DataBind();
            }else
            {
                add_floor_message.Text = "You have to select the Building first";
            }
        }

        protected void add_room_but_Click(object sender, EventArgs e)
        {
            if (corridors_GridView.SelectedValue != null)
            {
                int room_number = int.Parse(add_room_textbox.Text);
                string corridor_id = corridors_GridView.SelectedValue.ToString();
                ServerData.add_corridor_room(corridor_id, room_number,Is_Entrance.Checked, Session["__AccessToken"].ToString());
                add_room_message.Text = "";
                rooms_GridView.DataBind();
            }
            else
            {
                add_room_message.Text = "You have to select the Corridor first";
            }
        }

        protected void add_corridor_but_Click(object sender, EventArgs e)
        {
            if (Building_FloorsGridView.SelectedValue != null)
            {
                int corridor_number = int.Parse(corridor_number_textbox.Text);
                string floor_id = Building_FloorsGridView.SelectedValue.ToString();
                ServerData.add_floor_corridor(floor_id, corridor_number, Session["__AccessToken"].ToString());
                add_corridor_message.Text = "";
                corridors_GridView.DataBind();
            }
            else
            {
                add_corridor_message.Text = "You have to select the Floor first";
            }
        }

        protected void add_corridor_link_but_Click(object sender, EventArgs e)
        {
            if (corridors_GridView.SelectedValue != null)
            {
                if (add_corridor_link_ddl.SelectedValue != null && add_corridor_link_ddl.SelectedValue != string.Empty)
                {
                    string corridor1_number = corridors_GridView.SelectedValue.ToString();
                    string corridor2_number = add_corridor_link_ddl.SelectedValue;
                    string res = ServerData.add_corridor_link(corridor1_number, corridor2_number, Session["__AccessToken"].ToString());
                    corridor_links_GridView.DataBind();
                    add_corridor_link_message.Text = res;
                }
                else
                {
                    add_corridor_link_message.Text = "You have to select the 'To' Corridor first";
                }
            }
            else
            {
                add_corridor_link_message.Text = "You have to select the 'From' Corridor first";
            }
        }

        protected void buildings_GridView_SelectedIndexChanged(object sender, EventArgs e)
        {
            Building_FloorsGridView.DataBind();
            rooms_GridView.DataBind();
            corridors_GridView.DataBind();
            corridor_links_GridView.DataBind();
            add_corridor_link_ddl.DataBind();
        }

        public  void update_corridor_satatus(Corridor c)
        {
            ServerData.update_corridor_status(c.id, c.number,c.maxquantity, c.is_active, Session["__AccessToken"].ToString());
        }

        public  List<Corridor> get_floor_corridors(string floor_id)
        {
            return ServerData.get_floor_corridors(floor_id, Session["__AccessToken"].ToString());
        }


        public void update_room_satatus(Room r)
        {
            ServerData.update_room_status(r.id,r.number,r.type,r.maxquantity,r.is_active, Session["__AccessToken"].ToString());
        }

        public List<Room> get_corridor_rooms(string corridor_id)
        {
            return ServerData.get_corridor_rooms(corridor_id, Session["__AccessToken"].ToString());
        }
        protected void corridors_GridView_RowCommand(object sender, GridViewCommandEventArgs e)
        {
           /* if (!string.IsNullOrEmpty(e.CommandArgument.ToString()))
            {
                GridViewRow row = corridors_GridView.Rows[int.Parse(e.CommandArgument.ToString())];

                string id = row.Cells[0].Text;
                // string Corridor_Number = ((Literal)row.FindControl("Corridor_Number")).Text;
                // string is_active = ((CheckBox)row.FindControl("is_active")).Checked.ToString();
                string accessToken = Session["__AccessToken"].ToString();



                if (e.CommandName.Equals("Update"))
                {                    
                   // CorridorsDataSource.UpdateParameters["Corridor_Number"].DefaultValue = Corridor_Number;
                   // CorridorsDataSource.UpdateParameters["is_active"].DefaultValue = is_active;
                    CorridorsDataSource.UpdateParameters["accessToken"].DefaultValue = accessToken;
                    CorridorsDataSource.Update();
                }
            }*/
        }
    }
}