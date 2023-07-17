import {getWindow} from "ssr-window";


if (typeof window === "undefined") {
    global.window = getWindow();
}

if (!global.window.__PRELOADED_STATE__) {
    global.window.__PRELOADED_STATE__ = {};
}
