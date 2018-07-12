using System;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Collections.Generic;

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

        private static Dictionary<int, object> _instances = new Dictionary<int, object>();

        public static string CreateInstance(string assemblyName, string typeName)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies().First(x => x.GetName().Name == assemblyName);
            Type foundType = FindType(typeName, assembly);

            if (foundType != null)
            {
                var instance = Activator.CreateInstance(foundType);
                _instances.Add(instance.GetHashCode(), instance);
                return instance.GetHashCode().ToString();
            }

            return "0";
        }

        public static string GetTypeInstanceMethods(string assemblyName, string typeName)
        {
            return GetTypeMethods(assemblyName, typeName, BindingFlags.Instance | BindingFlags.Public);
        }

        public static string GetTypeStaticMethods(string assemblyName, string typeName)
        {
            return GetTypeMethods(assemblyName, typeName, BindingFlags.Static | BindingFlags.Public);
        }

        public static string GetTypeMethods(string assemblyName, string typeName, BindingFlags bindingFlags)
        {
            StringBuilder methods = new StringBuilder();
            methods.Append("[");
            var assembly = AppDomain.CurrentDomain.GetAssemblies().First(x => x.GetName().Name == assemblyName);
            Type foundType = FindType(typeName, assembly);

            if (foundType != null)
            {
                foreach (var method in foundType.GetMethods(bindingFlags).Where(x => x.DeclaringType != typeof(object)))
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

        private static Type FindType(string typeName, Assembly assembly)
        {
            Type foundType = null;
            foreach (var type in assembly.GetTypes())
            {
                if (type.FullName.Contains(typeName))
                {
                    foundType = type;
                    break;
                }
            }

            return foundType;
        }
    }
}
