import { Assembly } from "./assembly";
import { Method } from "./method";
import { ReflectionHelper } from "../utilities/reflectionhelper";

declare var Module;

export class Type
{
    private _typePath: string;
    private _assembly: Assembly;
    private _find_class: any;
    private _internalType: any;
    private _namespace: string;
    private _typeName: string;
    public constructor(assembly: Assembly, internalType: number, namespace: string, typeName: string, typePath: string)
    {
        this._assembly = assembly;
        this._typePath = typePath;
        this._namespace = namespace;
        this._typeName = typeName;
        this._internalType = internalType;
    }

    public getMethod(name: string)
    {
        var find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
        var internalMethod = find_method(this._internalType, name, -1);

        if (internalMethod === 0)
        {
            throw new Error("Cannot find method '" + name + "'!");
        }

        return new Method(this, internalMethod, name);
    }

    public getMethods(): Method[]
    {
        var methods = [];
        var methodsString = ReflectionHelper.getTypeStaticMethods(this._assembly.name, this._typePath);

        var methodsArray = JSON.parse(methodsString);
        for (let method of methodsArray)
        {
            methods.push(this.getMethod(method));
        }

        return methods;
    }

    public get internalType(): any
    {
        return this._internalType;
    }

    public get isValid(): boolean
    {
        return this._internalType !== 0;
    }
}