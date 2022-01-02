import { ConfigAPI } from '@babel/core';
import create, { Options } from './create';

const configFunction = (api: ConfigAPI, options?: Options) => {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'production';

    return create(env, api, { ...options, noReact: true });
};

export default configFunction;
