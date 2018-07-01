using System;
using System.Linq;
using System.Text;

namespace JSharp
{
    public static class Reflection
    {
        public static string GetAssemblyTypes(string assemblyName)
        {
            StringBuilder types = new StringBuilder();
            types.Append("[");
            var assembly = AppDomain.CurrentDomain.GetAssemblies().FirstOrDefault(x => x.GetName().Name == assemblyName);
            foreach (var type in assembly.GetTypes())
            {
                if (!type.FullName.Contains("<>"))
                {
                    types.Append($"\"{type.FullName}\",");
                }
            }

            types = types.Remove(types.Length - 1, 1);
            types.Append("]");

            return types.ToString();
        }
    }
}
