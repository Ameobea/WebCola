const wasm = require('./wasm-plugin/index');

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // console.log(config);
    if (!config.plugins) {
      config.plugins = [];
    }
    config.plugins.push(wasm({
      disableNodeSupport: true,
    }));

    return config; // always return a config.
  },
};
