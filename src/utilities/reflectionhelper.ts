import { CSharpLoader } from "../loader/csharploader";

export class ReflectionHelper
{
    public static getAssemblyTypes(assemblyName: string)
    {
        var jSharpAssembly = CSharpLoader.instance.getJSharpAssembly();
        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var assemblyTypesMethod = reflectionType.getMethod("GetAssemblyTypes");

        var types = assemblyTypesMethod.invoke([assemblyName]);

        return types;
    }

    public static getTypeStaticMethods(assemblyName: string, typeName: string)
    {
        var jSharpAssembly = CSharpLoader.instance.getJSharpAssembly();
        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var typeStaticMethods = reflectionType.getMethod("GetTypeStaticMethods");

        var types = typeStaticMethods.invoke([assemblyName, typeName]);

        return types;
    }
}