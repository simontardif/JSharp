import { Assembly } from "./assembly";
import { Method } from "./method";

declare var Module;

export class Type
{
    private _classPath: string;
    private _assembly: Assembly;
    private _find_class: any;
    private _internalType: any;
    public constructor(assembly: Assembly, classPath: string)
    {
        this._assembly = assembly;
        this._classPath = classPath;
        var namespace: string;
        var typeName: string;
        var lastDot = classPath.lastIndexOf(".");
        if (lastDot !== -1)
        {
            namespace = classPath.substr(0, lastDot);
            typeName = classPath.substr(lastDot+1, )
        }
        
        this._find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
        this._internalType = this._find_class(assembly.internalAssembly, namespace, typeName);
    }

    public getMethod(name: string)
    {
        return new Method(this, name);
    }

    public get internalType(): any
    {
        return this._internalType;
    }
}