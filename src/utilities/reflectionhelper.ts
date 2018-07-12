import { JSharp } from "../loader/csharploader";
import * as npMethodInfo from "../reflection/methodinfo";

export class ReflectionHelper
{
    public static getAssemblyTypes(assemblyName: string) : string
    {
        var jSharpAssembly = JSharp.CSharpLoader.instance.getJSharpAssembly();
        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var assemblyTypesMethod = reflectionType.getMethod("GetAssemblyTypes");

        var types = assemblyTypesMethod.invoke([assemblyName]);

        return types;
    }

    public static getTypeMethods(assemblyName: string, typeName: string, methodInfo: npMethodInfo.JSharp.MethodInfo) : string
    {
        if (methodInfo === npMethodInfo.JSharp.MethodInfo.Static)
        {
            return ReflectionHelper.getTypeStaticMethods(assemblyName, typeName);
        }
        else if (methodInfo === npMethodInfo.JSharp.MethodInfo.Instance)
        {
            return ReflectionHelper.getTypeInstanceMethods(assemblyName, typeName);
        }
    }

    public static getTypeStaticMethods(assemblyName: string, typeName: string) : string
    {
        var jSharpAssembly = JSharp.CSharpLoader.instance.getJSharpAssembly();
        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var typeStaticMethods = reflectionType.getMethod("GetTypeStaticMethods");

        var types = typeStaticMethods.invoke([assemblyName, typeName]);

        return types;
    }

    public static getTypeInstanceMethods(assemblyName: string, typeName: string) : string
    {
        var jSharpAssembly = JSharp.CSharpLoader.instance.getJSharpAssembly();
        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var typeInstanceMethods = reflectionType.getMethod("GetTypeInstanceMethods");

        var types = typeInstanceMethods.invoke([assemblyName, typeName]);

        return types;
    }

    public static logLoadedAssemblies(): void
    {
        var jSharpAssembly = JSharp.CSharpLoader.instance.getJSharpAssembly();
        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var logAssembliesMethod = reflectionType.getMethod("LogLoadedAssemblies");

        logAssembliesMethod.invoke();
    }

    public static startJSharpEngine(): void
    {
        var jSharpAssembly = JSharp.CSharpLoader.instance.getJSharpAssembly();

        var reflectionType = jSharpAssembly.getType("JSharp.Engine");
        var startEngineMethod = reflectionType.getMethod("Start");

        startEngineMethod.invoke();
    }

    public static createInstance(assemblyName: string, typeName: string): string
    {
        var jSharpAssembly = JSharp.CSharpLoader.instance.getJSharpAssembly();

        var reflectionType = jSharpAssembly.getType("JSharp.Reflection");
        var createInstanceMethod = reflectionType.getMethod("CreateInstance");

        return createInstanceMethod.invoke([assemblyName, typeName]);
    }
}