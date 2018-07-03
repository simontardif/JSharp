// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using Mono.WebAssembly.Interop;
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MonoClient
{
    public static class Client
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

        public static string RepeatString(string str, int count)
        {
            var result = new StringBuilder();

            for (var i = 0; i < count; i++)
            {
                result.Append(str);
            }

            return result.ToString();
        }

        public static void TriggerException(string message)
        {
            throw new InvalidOperationException(message);
        }

        public static string EvaluateJavaScript(string expression)
        {
            var result = InternalCalls.InvokeJSUnmarshalled<string, string, object, object>(out var exceptionMessage, "evaluateJsExpression", expression, null, null);
            if (exceptionMessage != null)
            {
                return $".NET got exception: {exceptionMessage}";
            }

            return $".NET received: {(result ?? "(NULL)")}";
        }

        public static string CallJsNoBoxing(int numberA, int numberB)
        {
            // For tests that call this method, we'll exercise the 'BlazorInvokeJS' code path
            // since that doesn't box the params
            var result = InternalCalls.InvokeJSUnmarshalled<int, int, object, int>(out var exceptionMessage, "divideNumbersUnmarshalled", numberA, numberB, null);
            if (exceptionMessage != null)
            {
                return $".NET got exception: {exceptionMessage}";
            }

            return $".NET received: {result}";
        }

        public static string GetRuntimeInformation()
            => $"OSDescription: '{RuntimeInformation.OSDescription}';"
            + $" OSArchitecture: '{RuntimeInformation.OSArchitecture}';"
            + $" IsOSPlatform(WEBASSEMBLY): '{RuntimeInformation.IsOSPlatform(OSPlatform.Create("WEBASSEMBLY"))}'";
    }
}
