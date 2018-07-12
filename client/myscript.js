// initMono(['../.net/MonoSanityClient.dll'], function () {
//     var a = 12;
//     var b = 13;
//     var result = invokeMonoMethod('MonoSanityClient', 'MonoSanityClient', 'Examples', 'AddNumbers', [a, b]);
//   });

var cSharpLoader = jsharp.CSharpLoader.instance;

var assemblies = cSharpLoader.loadAssemblies(['./MonoClient.dll'], () =>
{
    // The assembly is loaded and runtime as well (example taken from blazor)
    var assembly = assemblies[0];
    var instance = assembly.createInstance("MonoClient.Client");
    var result = instance.TestInstanceMethod([12, 13]); // Test instance method
    result = instance.Class.Test([12, 13]); // Test static method

    var myClass = assembly.getClass("MonoClient.Client"); // Without creating a instance
    result = myClass.Test([12, 13]); // Test static method

    var htmlElement = document.getElementById("myCSharpMethod");
    htmlElement.innerHTML = "C# Result: " + result;
});
