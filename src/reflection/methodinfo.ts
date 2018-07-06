export namespace JSharp
{
    export enum MethodInfo
    {
        Static,
        Instance
    }
}

declare class window
{
    static jsharp: any;
}

// Create a global variable in the window scope
window.jsharp = window.jsharp || {};
window.jsharp['MethodInfo'] = JSharp.MethodInfo;