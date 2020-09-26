export const isDev = process.env.NODE_ENV === "development";

let notificationCallback: (message: string) => void;

const modulesToDebug: string[] = process.env.DEBUG ? process.env.DEBUG.replace(/\s/g, "").split(",") : [];
let lastLoggedAt: number = Date.now();

export default class Logger {
    private readonly tag: string;
    private readonly isDebug: boolean;

    static registerErrorCallback(callback: (message: string) => void) {
        notificationCallback = callback
    }

    constructor(className: string, debug?: boolean) {
        this.tag = className;
        this.isDebug = debug ? debug : modulesToDebug.includes(className);
    }

    public debug(...args: any) {
        if (isDev && this.isDebug) logMessage(false, this.tag, ...args);
    }

    public info(...args: any) {
        logMessage(false, this.tag, ...args);
    }

    public error(error: Error | string) {
        const message = (error instanceof Error) ? error.message : error;
        logMessage(true, this.tag, (isDev ? error : message));
        if (typeof notificationCallback === "function") {
            notificationCallback(message)
        }
    }
}

function logMessage(isError: boolean, tag:string, ...args: any) {
    const diff = Date.now() - lastLoggedAt;
    const prefix = tag + " >> " + (isError ? "ERROR: " : "");
    console.log(prefix, ...args, "["+diff+"ms]");
    lastLoggedAt = Date.now();
}



export const ERROR_MSGS = {};
