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
    private _internalAssembly: any;
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

    getClass(classPath: string): Type
    {
        return new Type(this, classPath);
    }

    public init()
    {
        this._isLoaded = true;
        this._assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
        this._internalAssembly = this._assembly_load(this._assemblyName);
    }
}