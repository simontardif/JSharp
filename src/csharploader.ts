export class CSharpLoader
{
    private static _cSharpLoader: CSharpLoader;
    public constructor()
    {

    }

    public static get Instance(): CSharpLoader
    {
        if (!this._cSharpLoader)
        {
            this._cSharpLoader = new CSharpLoader();
        }

        return this._cSharpLoader;
    }

    public LoadAssemblies(): void
    {

    }
}

