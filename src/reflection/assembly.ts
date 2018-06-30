import { WasmUtils } from "../utilities/wasmutils";
import { Type } from "./type";

declare var FS;
declare var Module;

export class Assembly
{
    private _assemblyName: string;
    private _isLoaded: boolean;
    private _url: string;
    private _assembly_load: any;
    private _internalAssembly: number;
    public constructor(url: string)
    {
        this._url = url;
        this._assemblyName = WasmUtils.getAssemblyNameFromUrl(url);

        this._isLoaded = false;
    }

    public get name(): string
    {
        return this._assemblyName;
    }

    public get url(): string
    {
        return this._url;
    }

    public get internalAssembly(): any
    {
        return this._internalAssembly;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isValid(): boolean
    {
        return this._internalAssembly !== 0;
    }

    getType(typePath: string): Type
    {
        var namespace: string;
        var typeName: string;
        var lastDot = typePath.lastIndexOf(".");
        if (lastDot !== -1)
        {
            namespace = typePath.substr(0, lastDot);
            typeName = typePath.substr(lastDot + 1, )
        }

        var find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
        var internalType = find_class(this._internalAssembly, namespace, typeName);
        if (internalType === 0)
        {
            throw new Error("Cannot find type path" + typePath)
        }

        return new Type(this, internalType, namespace, typeName, typePath);
    }

    public init()
    {
        this._isLoaded = true;
        this._assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
        this._internalAssembly = this._assembly_load(this._assemblyName);

        if (!this.isValid)
        {
            throw new Error("Invalid Assembly Name!" + this._assemblyName)
        }
    }
}