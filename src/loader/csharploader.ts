import { Assembly } from "../reflection/assembly";
import { WasmUtils } from "../utilities/wasmutils";

declare var WebAssembly;
declare var Module;
declare var FS;
declare class window
{
    static Browser: { init: () => void; asyncLoad: (url: any, onload: any, onerror: any) => void; };
    static Module: { print: (line: any) => void; printEr: (line: any) => void; locateFile: (fileName: any) => any; preloadPlugins: any[]; preRun: (() => void)[]; postRun: (() => void)[]; };
    static DotNet: { jsCallDispatcher: { findJSFunction: (identifier: any) => any; }; };
}

export class CSharpLoader
{
    private static _cSharpLoader: CSharpLoader;
    private _monoRuntimeScriptUrl: string;
    private _hasPreloadedAssemblies: boolean;
    private _assemblies: any;
    public constructor()
    {
        this._assemblies = {};
        var browserSupportsNativeWebAssembly = typeof WebAssembly !== 'undefined' && WebAssembly.validate;
        var monoRuntimeUrlBase = (browserSupportsNativeWebAssembly ? 'wasm' : 'asmjs');
        this._monoRuntimeScriptUrl = "../" + monoRuntimeUrlBase + '/mono.js';

         // This part load the mono runtime
        //this.initAssemblies();
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
                    case 'mono.wasm': return '../wasm/mono.wasm';
                    case 'mono.asm.js': return '../asmjs/mono.asm.js';
                    default: return fileName;
                }
            },
            preloadPlugins: [],
            preRun: [() => {
                theThis.preloadAssemblies();
                var counter: number = 0;
                for (var property in theThis._assemblies) {
                    if (theThis._assemblies.hasOwnProperty(property)) {
                        var assemblyName = theThis._assemblies[property].name;
                        var assemblyUrl = theThis._assemblies[property].url;
                        FS.createPreloadedFile('appBinDir', assemblyName + '.dll', assemblyUrl, true, false, () => {
                            counter++;
                            theThis._hasPreloadedAssemblies = counter === Object.keys(theThis._assemblies).length;
                        }, function onError(err) {
                            throw err;
                        });
                    }
                }
            } ],
            postRun: [function () {
                theThis.loadRuntime();
                for (var property in theThis._assemblies) {
                    if (theThis._assemblies.hasOwnProperty(property)) {
                        theThis._assemblies[property].init();
                    }
                }
                if (theThis._onLoaded) {
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
    public loadAssembly(url: string, onLoaded: ()=> void): Assembly
    {
        this._onLoaded = onLoaded;
        this._assemblies[url] = new Assembly(url);
        this.initAssemblies();
        return this._assemblies[url];
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

    private preloadAssemblies(): void {
        var loadBclAssemblies = [
          'netstandard',
          'mscorlib',
          'System',
          'System.Core',
        ];
    
        var allAssemblyUrls = (loadBclAssemblies.map(function (name) { return '../.net/' + name + '.dll'; }));
    
        Module.FS_createPath('/', 'appBinDir', true, true);
        allAssemblyUrls.forEach(function (url) {
          FS.createPreloadedFile('appBinDir', WasmUtils.getAssemblyNameFromUrl(url) + '.dll', url, true, false, null, function onError(err) {
            throw err;
          });
        });
      }

    //#endregion
}

