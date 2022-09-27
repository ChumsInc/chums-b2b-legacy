var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var defaultState = {
    versionNo: '',
    changed: false,
    lastChecked: new Date().valueOf(),
    loading: false,
    ignored: '',
};
export var minCheckInterval = 15 * 60 * 1000;
export var versionFetchRequested = 'version/fetchRequested';
export var versionFetchSucceeded = 'version/fetchSucceeded';
export var versionFetchFailed = 'version/fetchFailed';
export var versionIgnored = 'version/ignored';
export var versionURL = '/version';
export var loadingSelector = function (state) { return state.version.loading; };
export var shouldCheckVersion = function (state) { return !loadingSelector(state)
    && state.version.versionNo !== ''
    && (new Date().valueOf() - state.version.lastChecked > minCheckInterval); };
export var changedSelector = function (state) { return state.version.changed && state.version.versionNo !== state.version.ignored; };
export var versionSelector = function (state) { return state.version.versionNo; };
var versionReducer = function (state, action) {
    if (state === void 0) { state = __assign({}, defaultState); }
    var type = action.type, payload = action.payload;
    switch (type) {
        case versionFetchRequested:
            return __assign(__assign({}, state), { loading: true });
        case versionFetchFailed:
            return __assign(__assign({}, state), { loading: false });
        case versionFetchSucceeded:
            if ((payload === null || payload === void 0 ? void 0 : payload.versionNo) && (payload === null || payload === void 0 ? void 0 : payload.lastChecked)) {
                return {
                    versionNo: payload.versionNo,
                    changed: payload.versionNo !== state.versionNo && state.versionNo !== defaultState.versionNo,
                    loading: false,
                    lastChecked: payload.lastChecked,
                    ignored: payload.versionNo,
                };
            }
            return state;
        case versionIgnored:
            return __assign(__assign({}, state), { changed: false, ignored: state.versionNo });
        default: return state;
    }
};
export default versionReducer;
//# sourceMappingURL=index.js.map