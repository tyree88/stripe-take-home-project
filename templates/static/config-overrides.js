
const { injectBabelPlugin } = require('react-app-rewired');

const rootImportConfig = [
    "root-import",
    {
        rootPathPrefix: "~",
        rootPathSuffix: "static"
    }
];

module.exports = config => injectBabelPlugin(rootImportConfig, config);