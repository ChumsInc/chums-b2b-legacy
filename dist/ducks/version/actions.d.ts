import { ScreenThunkAction, VersionAction } from "./index";
export declare const fetchVersion: (force?: boolean | undefined) => ScreenThunkAction;
export declare const ignoreVersion: () => VersionAction;
