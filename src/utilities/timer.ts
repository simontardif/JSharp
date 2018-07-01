export class Timer
{
    private _start: Date;
    private _end: Date;
    public constructor()
    {
        this._start = null;
        this._end = null;
    }
    public start(): void
    {
        this._start = new Date();
    }

    public stop(): void
    {
        if (!this._start)
        {
            this._start = new Date();
        }
        this._end = new Date();
    }

    public get ellapsedTime(): number
    {
        if (!this._start || !this._end)
        {
            return 0;
        }

        return this._end.getTime() - this._start.getTime();
    }
}