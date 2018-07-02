// initMono(['../.net/MonoSanityClient.dll'], function () {
//     var a = 12;
//     var b = 13;
//     var result = invokeMonoMethod('MonoSanityClient', 'MonoSanityClient', 'Examples', 'AddNumbers', [a, b]);
//   });

var assemblies = jsharp.loadAssemblies(['./MonoClient.dll'], () =>
{
    // The assembly is loaded and runtime as well (example taken from blazor)
    var assembly = assemblies[0];
    var allTypes = assembly.getTypes();
    var myType = assembly.getType("MonoClient.Client");
    var methods = myType.getMethods();
    var myMethod = myType.getMethod("Test");
    var a = 12;
    var b = 13;
    var result = myMethod.invoke([a,b]);

    var htmlElement = document.getElementById("myCSharpMethod");
    htmlElement.innerHTML = "C# Result: " + result;
});
