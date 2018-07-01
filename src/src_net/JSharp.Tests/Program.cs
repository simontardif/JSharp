using System;

namespace JSharp.Tests
{
    class Program
    {
        static void Main(string[] args)
        {
            TestAssemblyTypes();
        }

        private static void TestAssemblyTypes()
        {
            var types = JSharp.Reflection.GetAssemblyTypes("JSharp.Tests");
            Console.WriteLine(types);
        }
    }
}
