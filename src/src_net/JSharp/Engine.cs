using System;
using System.Threading.Tasks;

namespace JSharp
{
    public class Engine
    {
        public static async void Start()
        {
            while(true)
            {
                Console.WriteLine("Engine Tick");
                await Task.Delay(1000);
            }
        }
    }
}