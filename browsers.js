const browserslist = require('./browserslist');
const create = require('./create');

module.exports = (api, options) => {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV;
    const browsers = options.browsers || browserslist[env];

    return create(api, { ...options, browsers }, env);
};
