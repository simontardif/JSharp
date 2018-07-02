using System;

namespace JSharp.Tests
{
    class Program
    {
        static void Main(string[] args)
        {
            TestAssemblyTypes();
            TestTypeStaticMethods();
        }

        private static void TestAssemblyTypes()
        {
            var types = JSharp.Reflection.GetAssemblyTypes("JSharp.Tests");
            Console.WriteLine(types);
        }

        private static void TestTypeStaticMethods()
        {
            var staticMethods = JSharp.Reflection.GetTypeStaticMethods("JSharp.Tests", "JSharp.Tests.AnotherType");
            Console.WriteLine(staticMethods);
        }
    }
}
