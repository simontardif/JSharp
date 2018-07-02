using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Reflection;

namespace JSharp.Tests
{
    [TestClass]
    public class ReflectionTests
    {
        [TestMethod]
        public void TestGetAssemblyTypes()
        {
            Assembly.Load("JSharp");
            var types = Reflection.GetAssemblyTypes("JSharp");
            Assert.AreEqual("[\"JSharp.Reflection\"]", types);
        }

        [TestMethod]
        public void TestGetTypeStaticMethods()
        {
            var staticMethods = JSharp.Reflection.GetTypeStaticMethods("JSharp.Tests", "JSharp.Tests.AnotherType");
            Assert.AreEqual("[\"MyStaticMethod\"]", staticMethods);
        }
    }
}
