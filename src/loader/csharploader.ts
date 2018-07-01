import { Assembly } from "../reflection/assembly";
import { WasmUtils } from "../utilities/wasmutils";

declare var SystemJS;
declare var WebAssembly;
declare var Module;
declare var FS;

export class CSharpLoader
{
    private static _cSharpLoader: CSharpLoader;
    private _monoRuntimeScriptUrl: string;
    private _assemblies: any;
    _preloadedAssemblies: string[];
    public constructor()
    {
        this._assemblies = {};
        var browserSupportsNativeWebAssembly = typeof WebAssembly !== 'undefined' && WebAssembly.validate;
        var monoRuntimeUrlBase = (browserSupportsNativeWebAssembly ? 'wasm' : 'asmjs');
        this._monoRuntimeScriptUrl = "./" + monoRuntimeUrlBase + '/mono.js';

        var loadBclAssemblies = [
            'netstandard',
            'mscorlib',
            'System',
            'System.Core',
            'Newtonsoft.Json',
            'JSharp'
        ];
    
        this._preloadedAssemblies = (loadBclAssemblies.map(function (name) { return './' + name + '.dll'; }));

        for (let url of this._preloadedAssemblies)
        {
            var assembly = new Assembly(url);
            this._assemblies[url] = assembly;
        }
    }

    private initAssemblies() {
        window.DotNet = {
            jsCallDispatcher: {
                findJSFunction: function (identifier) {
                    return window[identifier];
                }
            }
        };
        // Create Browser instance
        window.Browser = {
            init: function () { },
            asyncLoad: this.asyncLoad
        };
        var theThis = this;
        //Create Module instance
        window.Module = {
            print: function (line) { console.log(line); },
            printEr: function (line) { console.error(line); },
            locateFile: function (fileName) {
                switch (fileName) {
                    case 'mono.wasm': return './wasm/mono.wasm';
                    case 'mono.asm.js': return './asmjs/mono.asm.js';
                    default: return fileName;
                }
            },
            preloadPlugins: [],
            preRun: [() => {
                theThis.preloadAssemblies();
               
            } ],
            postRun: [function () {
                theThis.loadRuntime();
                for (var property in theThis._assemblies) 
                {
                    if (theThis._assemblies.hasOwnProperty(property)) 
                    {
                        theThis._assemblies[property].init();
                    }
                }
                if (theThis._onLoaded) 
                {
                    theThis._onLoaded();
                }
            } ]
        };

        var scriptElem = document.createElement('script');
        scriptElem.src = this._monoRuntimeScriptUrl;
        document.body.appendChild(scriptElem);
    }

    //#region Public API

    public static get instance(): CSharpLoader
    {
        if (!this._cSharpLoader)
        {
            this._cSharpLoader = new CSharpLoader();
        }

        return this._cSharpLoader;
    }

    private _onLoaded: () => void;
    public loadAssemblies(urls: string[], onLoaded: () => void): Assembly[]
    {
        this._onLoaded = onLoaded;
        var assemblies = [];
        for (let url of urls)
        {
            var assembly = new Assembly(url);
            assemblies.push(assembly)
            this._assemblies[url] = assembly;
        }

        this.initAssemblies();

        return assemblies;
    }

    getJSharpAssembly(): Assembly 
    {
        for (var property in this._assemblies) 
        {
            if (this._assemblies.hasOwnProperty(property)) 
            {
                var assemblyName = this._assemblies[property].name;
                if (assemblyName === "JSharp")
                {
                    return this._assemblies[property];
                }
            }
        }

        return null;
    }

    //#endregion

    //#region Private Methods

    private loadRuntime(): void
    {
        var load_runtime = Module.cwrap('mono_wasm_load_runtime', null, ['string']);
        load_runtime('appBinDir');
    }

    private asyncLoad(url, onload, onerror): void {
        var xhr = new XMLHttpRequest;
        xhr.open('GET', url, /* async: */ true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
            if (xhr.status === 200 || xhr.status === 0 && xhr.response) {
            var asm = new Uint8Array(xhr.response);
            onload(asm);
            } else {
            onerror(xhr);
            }
        };

        xhr.onerror = onerror;
        xhr.send(null);
    }

    private preloadAssemblies(): void 
    {
        Module.FS_createPath('/', 'appBinDir', true, true);
        for (var property in this._assemblies) 
        {
            if (this._assemblies.hasOwnProperty(property)) 
            {
                var assemblyName = this._assemblies[property].name;
                var assemblyUrl = this._assemblies[property].url;
                FS.createPreloadedFile('appBinDir', assemblyName + '.dll', assemblyUrl, true, false, () => {
                }, function onError(err) 
                {
                    throw err;
                });
            }
        }
    }

    //#endregion
}

declare class window
{
    static Browser: { init: () => void; asyncLoad: (url: any, onload: any, onerror: any) => void; };
    static Module: { print: (line: any) => void; printEr: (line: any) => void; locateFile: (fileName: any) => any; preloadPlugins: any[]; preRun: (() => void)[]; postRun: (() => void)[]; };
    static DotNet: { jsCallDispatcher: { findJSFunction: (identifier: any) => any; }; };
    static jsharp: CSharpLoader;
}

// Create a global variable in the window scope
var cSharpLoader = CSharpLoader.instance;
window.jsharp = cSharpLoader;