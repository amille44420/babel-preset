const create = require('./create');

module.exports = (api, options) => {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV;

    return create(api, { ...options, noReact: true }, env);
};
