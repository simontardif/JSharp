import { CSharpLoader } from "./csharploader";

export class Startup {
    public static main(): number {
        console.log('Hello World');
        CSharpLoader.Instance.LoadAssemblies();
        return 0;
    }
}

Startup.main();