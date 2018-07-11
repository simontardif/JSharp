[![Build Status](https://travis-ci.com/simontardif/JSharp.svg?branch=master)](https://travis-ci.com/simontardif/JSharp)
# JSharp

This project use TypeScript to load C# .Net Standard assemblies. <br>
https://simontardif.github.io/

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

<script src="jsharp.js"></script>

var cSharpLoader = jsharp.CSharpLoader.instance;

var assemblies = cSharpLoader.loadAssemblies(['./MonoClient.dll'], () =>
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

```

Future API ideas:
```csharp

var cSharpLoader = jsharp.CSharpLoader.instance;

var assemblies = await cSharpLoader.loadAssemblies(["MyAssembly.dll"]);
var assembly = assemblies.first("MyAssembly");

var myObject = assembly.createInstance("MyType"); // Create a javascript object with exposed methods that call C# methods
myObject.myInstanceMethod();
myObject.myOtherInstanceMethod();

myObject.Class.MyStaticMethod();

// DotNet Standard Execution (must find an entry point in the assembly)
jsharp.run("MyAssembly.dll");

```
