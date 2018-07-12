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

// Javascript Part

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

// C# Part
namespace MonoClient
{
    public class Client
    {
        public static string Test(int a, int b)
        {
            Console.WriteLine("Add number method!" + Thread.CurrentThread.ManagedThreadId);
            Task.Factory.StartNew(() =>
            {
                Console.WriteLine("This is a test!" + Thread.CurrentThread.ManagedThreadId);
            });

            return (RuntimeInformation.OSDescription + (a + b) + "another test!").ToString();
        }
        
        (...)

```

Future API ideas:
```csharp

// DotNet Standard Execution (must find an entry point in the assembly)
jsharp.run("MyAssembly.dll");

```
