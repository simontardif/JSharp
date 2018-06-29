[![Build Status](https://travis-ci.com/simontardif/TypeScriptCS.svg?branch=master)](https://travis-ci.com/simontardif/TypeScriptCS)
# TypeScriptCS

This project use TypeScript to load C# assemblies.

## Setup

NodeJS <br>
DotNet Core SDK<br>
Use VS Code for debugging TypeScript and Visual Studio for developping the C# parts. <br>

* <b>npm install</b>

## Dev

* <b>npm run build</b> (build project to /dist folder)
* <b>npm start</b> (start server)

First draft idea:
```csharp

<script src="system.js"></script>
<script src="TypeScriptCS.js"></script>

SystemJS.import('loader/csharploader').then(function (module) {
    var cSharpLoader = module.CSharpLoader;

    var assembly = cSharpLoader.instance.loadAssembly('./MonoSanityClient.dll', () =>
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
```
