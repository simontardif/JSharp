using System;
using System.Threading;
using System.Threading.Tasks;

namespace FrameworkClient
{
    public class Client
    {
        public static string AddNumbers(int a, int b)
        {
            Console.WriteLine("Add number method!" + Thread.CurrentThread.ManagedThreadId);
            Task.Factory.StartNew(() =>
            {
                Console.WriteLine("This is a test!" + Thread.CurrentThread.ManagedThreadId);
            });

            return (Environment.OSVersion.Platform + (a + b) + "another test!").ToString();
        }
    }
}
