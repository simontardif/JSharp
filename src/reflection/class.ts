import * as npType from "./type";
import * as npMethodInfo from "./methodinfo";

export namespace JSharp
{
    export class Class
    {
        private _type: npType.JSharp.Type;
        constructor(type: npType.JSharp.Type)
        {
            this._type = type;

            var staticMethods = this._type.getMethods(npMethodInfo.JSharp.MethodInfo.Static);
            staticMethods.forEach(method => {
                this[method.name] = (args:any[]) => method.invoke(args);
            });
        } 
    }
}