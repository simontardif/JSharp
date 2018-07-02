// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System.Threading.Tasks;

namespace MonoClient
{
    // Note: Not used at runtime. This exists only to give the server app some type to reference.
    // In realistic scenarios you'd have a Program class for real.

    public class Program
    {
        public static void Main(string[] args)
        {
            InitMainModule();
        }

        public static async void InitMainModule()
        {
            await Task.Delay(2000);
        }
    }
}
