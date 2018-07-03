using System;
using System.Linq;
using System.Text;
using System.Reflection;

namespace JSharp
{
    public static class Reflection
    {
        public static void LogLoadedAssemblies()
        {
            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                Console.WriteLine("Loaded Assembly: " + assembly.FullName);
            }
        }

        private static string[] InvalidChars = new string[] { "<", "+", ">" };
        public static string GetAssemblyTypes(string assemblyName)
        {
            StringBuilder types = new StringBuilder();
            types.Append("[");
            var assembly = AppDomain.CurrentDomain.GetAssemblies().First(x => x.GetName().Name == assemblyName);
            foreach (var type in assembly.GetTypes())
            {
                if (InvalidChars.All(x => !type.FullName.Contains(x)))
                {
                    types.Append($"\"{type.FullName}\",");
                }
            }

            var typesString = types.ToString();
            var lastComma = typesString.LastIndexOf(",");
            if (lastComma != -1)
            {
                typesString = typesString.Remove(lastComma, 1); // remove last comma
            }

            typesString = typesString.Insert(typesString.Length, "]");

            return typesString;
        }

        public static string GetTypeStaticMethods(string assemblyName, string typeName)
        {
            StringBuilder methods = new StringBuilder();
            methods.Append("[");
            var assembly = AppDomain.CurrentDomain.GetAssemblies().First(x => x.GetName().Name == assemblyName);
            Type foundType = null;
            foreach (var type in assembly.GetTypes())
            {
                if (type.FullName.Contains(typeName))
                {
                    foundType = type;
                    break;
                }
            }

            if (foundType != null)
            {
                foreach (var method in foundType.GetMethods(BindingFlags.Static | BindingFlags.Public))
                {
                   methods.Append($"\"{method.Name}\","); 
                }
            }

            var methodsString = methods.ToString();
            var lastComma = methodsString.LastIndexOf(",");
            if (lastComma != -1)
            {
                methodsString = methodsString.Remove(lastComma, 1); // remove last comma
            }

            methodsString = methodsString.Insert(methodsString.Length, "]");

            return methodsString;
        }
    }
}
