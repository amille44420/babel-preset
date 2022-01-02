import { ConfigAPI } from '@babel/core';
import { BrowserslistQuery } from '@babel/preset-env';
import browserslist from './browserslist';
import create, { Options } from './create';

const configFunction = (api: ConfigAPI, options?: Options) => {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'production';
    const browsers =
        (options?.browsers as BrowserslistQuery | ReadonlyArray<BrowserslistQuery>) ||
        (env && env in browserslist ? browserslist[env] : []);

    return create(env, api, { ...options, browsers });
};

export default configFunction;
