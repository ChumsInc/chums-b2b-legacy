import {PreloadedState} from "../types/preload";
import {Theme} from "@mui/material/styles";

declare global {
    interface Window {
        __PRELOADED_STATE__?: PreloadedState;
        gtag?: (event:string, eventName: string, options?: any) => void;
        theme?: Theme
    }
}

if (typeof global.window !== 'undefined') {
    console.log('initiating global window');
    if (!global.window?.__PRELOADED_STATE__) {
        global.window.__PRELOADED_STATE__ = {};
    }
}
