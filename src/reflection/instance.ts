import * as npType from "./type";
import * as npClass from "./class";
import * as npMethodInfo from "./methodinfo";

export namespace JSharp
{
    export class Instance
    {
        private _hashCode: number;
        private _type: npType.JSharp.Type;
        private _class: npClass.JSharp.Class;
        constructor(hashCode: number, type: npType.JSharp.Type)
        {
            this._hashCode = hashCode;
            this._type = type;
            this._class = new npClass.JSharp.Class(type);

            var instanceMethods = this._type.getMethods(npMethodInfo.JSharp.MethodInfo.Instance);
            instanceMethods.forEach(method => {
                this[method.name] = (args:any[]) => method.invoke(args);
            });
        }
        
        public get Class(): npClass.JSharp.Class
        {
            return this._class;
        }
    }
}