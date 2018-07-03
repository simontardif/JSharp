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
var assemblies = await jsharp.loadAssemblies(["MyAssembly.dll"]);
var assembly = assemblies.first("MyAssembly");

assembly.getTypes();
var myType = assembly.getType("MyType");

myType.getMethods(MethodInfo.Instance | MethodInfo.Static);
var myInstanceMethod = assembly.getMethod("MyInstanceMethod");

var instanceForType = myType.createInstance(args);
var res = myInstanceMethod.invoke(instanceForType, args);

var myStaticMethod = assembly.getMethod("MyStaticMethod");

res = myStaticMethod.invoke(null, args);

// DotNet Core Execution
jsharp.run("MyAssembly.dll");

```
