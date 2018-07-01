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
}