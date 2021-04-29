using FrontEnd.Model.Building_Structuer;
using FrontEnd.Model.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Web;

namespace FrontEnd.Control
{
    public class User_device
    {
        public string id;           
        public string user_id;       
        public string device_id;

        public static int lecture_time;
        public static int corridor_time;

        public bool is_live { set; get; }    // to control the thread 
        public bool is_started { set; get; } // used to check if the user started moving through the building 
        public Floor_part current_position { set; get; }
        public Queue<Floor_part> path;     // the steps that must follow to move from A --> B
        public int time_to_change;         // how much time the user will spend in the current position.
        public int lectuer_count;


        public Building_Graph building_Graph;

        Thread thread;

        public User_device(Building_Graph building_Graph)
        {
            Random rand = new Random();
            this.building_Graph = building_Graph;
            this.thread = new Thread(run);
            lectuer_count = rand.Next(1, 5); // Get a random count of lectuers  [1..4]
            is_live = false;
            is_started = false;
            path = new Queue<Floor_part>();


            int rand1= rand.Next(5- lectuer_count);
            int late_range = lecture_time / 10;
            int rund2 = rand.Next(0,late_range);
            int rund3 = rand.Next(2);
            if (rund3 == 0)
                time_to_change = Math.Abs((lecture_time * rand1) - rund2);
            else
                time_to_change = (lecture_time * rand1) + rund2;
        }

        public void start()
        {
            is_live = true;
            this.thread.Start();
        }
        public void stop()
        {
            is_live = false;
            this.thread.Abort();
        }

        private void run()
        {

            while (is_live)
            {
                if (path.Count > 0)   // the user has a path to follow
                {
                    current_position = path.Dequeue();
                    switch (current_position.type)
                    {
                        case "R":  // Room
                            time_to_change = lecture_time;
                            break;
                        case "C":  // Corridor
                            time_to_change = corridor_time;
                            break;
                        case "E":  // Entrance
                            time_to_change = corridor_time;
                            break;
                        default:
                            //Console.WriteLine("Default case");
                            break;
                    }
                }
                else    // the user has no path
                {
                    if (is_started)
                    {
                        if (current_position == null) // the user does not entered the building 
                        {
                            List<Floor_part> exits = building_Graph.vertics.Where(e => e.type == "E").ToList();
                            int rand = new Random().Next(0, exits.Count()); // select a random Entrance
                            current_position = exits.ElementAt(rand);       // set the current position = selected Entrance
                            time_to_change = corridor_time;                 // update the time_to_change
                        }
                        if (lectuer_count > 0)   // if the user has lectuers
                        {
                            path = generate_path(current_position, "R");  // generate a path to class Room
                            lectuer_count--;                              // update the lectuers count
                        }
                        else
                        {       // the user has no more lectuers 
                            if (current_position.type == "E") 
                            {
                                is_live = false; // stop the thread
                            }
                            else
                            {
                                path = generate_path(current_position, "E"); // generate a path from current position to Entrance
                            }
                        }
                    }

                }
                Thread.Sleep(time_to_change);   // make the thread stop working for some time = time_to_change
                is_started = true;
            }
        }

        private Queue<Floor_part> generate_path(Floor_part source, string target_type)
        {
            Queue<Floor_part> exit_path = new Queue<Floor_part>();
            int cur_index = building_Graph.vertics.IndexOf(source);  // get the index of the current position
            List<Floor_part> exits = building_Graph.vertics.Where(e => e.type == target_type).ToList();
            int rand = new Random().Next(exits.Count()); // get a random index of the target position where the type = target_type
            int target_index = building_Graph.vertics.IndexOf(exits.ElementAt(rand)); // calculate  the shotest path using Dijkstra
            string str_path = Dijkstra.DijkstraAlgo_path(building_Graph.adjacency_matrix, cur_index, target_index, building_Graph.vertics.Count());
            string[] indexes = str_path.Split(';');
            foreach (string s in indexes) // parsing the path and return it as a Queue.
            {

                try
                {
                    int index;
                    if (int.TryParse(s, out  index))
                    {
                        exit_path.Enqueue(building_Graph.vertics.ElementAt(index));
                    }
                        
                }
                catch (Exception e) { }


            }
            return exit_path;
        }

    }
}