
module.exports = function (api) {
    api.cache(true);
    const presets = [
        "@babel/preset-env",
        "@babel/preset-react"
    ];

    const plugins = [
        "@babel/plugin-transform-regenerator",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-async-to-generator",
    ];


    return {
        presets,
        plugins,
    };
};