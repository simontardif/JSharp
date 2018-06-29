declare var Module;

export class WasmUtils
{
    static getAssemblyNameFromUrl(url: string)
    {
        var lastSegment = url.substring(url.lastIndexOf('/') + 1);
        var queryStringStartPos = lastSegment.indexOf('?');
        var filename = queryStringStartPos < 0 ? lastSegment : lastSegment.substring(0, queryStringStartPos);

        return filename.replace(/\.dll$/, '');
    }

    public static javaScriptStringToDotNetString(javaScriptString) {
        var mono_string = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']);
        return mono_string(javaScriptString);
    };

    public static dotnetStringToJavaScriptString(mono_obj) {
        if (mono_obj === 0)
          return null;

        var mono_string_get_utf8 = Module.cwrap('mono_wasm_string_get_utf8', 'number', ['number']);
        var raw = mono_string_get_utf8(mono_obj);
        var res = Module.UTF8ToString(raw);
        Module._free(raw);

        return res;
      };
}