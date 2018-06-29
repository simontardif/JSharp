// initMono(['../.net/MonoSanityClient.dll'], function () {
//     var a = 12;
//     var b = 13;
//     var result = invokeMonoMethod('MonoSanityClient', 'MonoSanityClient', 'Examples', 'AddNumbers', [a, b]);
//   });

SystemJS.import('loader/csharploader').then(function (module) {
    var cSharpLoader = module.CSharpLoader;
    // try new api
    var assembly = cSharpLoader.instance.loadAssembly('../.net/MonoSanityClient.dll', () =>
    {
        // The assembly is loaded and runtime as well (example taken from blazor)
        var examplesClass = assembly.getClass("MonoSanityClient.Examples")
        var addNumbersMethod = examplesClass.getMethod("AddNumbers");
        var a = 12;
        var b = 13;
        var result = addNumbersMethod.invoke([a,b]);

        var htmlElement = document.getElementById("myCSharpMethod");
        htmlElement.innerHTML = "C# Result: " + result;
    });
});