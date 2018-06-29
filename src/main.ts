import { CSharpLoader } from "./loader/csharploader";

export class Startup {
    public static main(): number {
        console.log('Startup called.');
        var assembly = CSharpLoader.instance.loadAssembly('../.net/MonoSanityClient.dll', () =>
        {
            // The assembly is loaded and runtime as well
            var examplesClass = assembly.getClass("MonoSanityClient.Examples")
            var addNumbersMethod = examplesClass.getMethod("AddNumbers");
            var a = 12;
            var b = 13;
            var result = addNumbersMethod.invoke([a,b]);

            var htmlElement = document.getElementById("myCSharpMethod");
            htmlElement.innerHTML = "C# Result: " + result;
        });
        return 0;
    }
}

Startup.main();