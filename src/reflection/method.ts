import { Type } from "./type";
import { WasmUtils } from "../utilities/wasmutils";

declare var Module;

export class Method
{
    private _name: string;
    private _type: Type;
    private _find_method: any;
    private _internalMethod: any;
    public constructor(type: Type, name: string)
    {
        this._type = type;
        this._name = name;

        this._find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
        this._internalMethod = this._find_method(type.internalType, this._name, -1);
    }

    public invoke(args: any = null): any
    {
        var stack = Module.stackSave();
        try {
          var resultPtr = this.callMethod(this._internalMethod, null, args);
          return WasmUtils.dotnetStringToJavaScriptString(resultPtr);
        }
        finally {
          Module.stackRestore(stack);
        }
    }

    callMethod(method, target, args) {
        var stack = Module.stackSave();
        var invoke_method = Module.cwrap('mono_wasm_invoke_method', 'number', ['number', 'number', 'number']);
    
        try {
          var argsBuffer = Module.stackAlloc(args.length);
          var exceptionFlagManagedInt = Module.stackAlloc(4);
          for (var i = 0; i < args.length; ++i) {
            var argVal = args[i];
            if (typeof argVal === 'number') {
              var managedInt = Module.stackAlloc(4);
              Module.setValue(managedInt, argVal, 'i32');
              Module.setValue(argsBuffer + i * 4, managedInt, 'i32');
            } else if (typeof argVal === 'string') {
              var managedString = WasmUtils.javaScriptStringToDotNetString(argVal);
              Module.setValue(argsBuffer + i * 4, managedString, 'i32');
            } else {
              throw new Error('Unsupported arg type: ' + typeof argVal);
            }
          }
          Module.setValue(exceptionFlagManagedInt, 0, 'i32');
    
          var res = invoke_method(method, target, argsBuffer, exceptionFlagManagedInt);
    
          if (Module.getValue(exceptionFlagManagedInt, 'i32') !== 0) {
            throw new Error(WasmUtils.dotnetStringToJavaScriptString(res));
          }
    
          return res;
        } finally {
          Module.stackRestore(stack);
        }
      }
}