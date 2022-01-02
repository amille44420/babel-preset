import { BrowserslistQuery } from '@babel/preset-env';

const browserslist: { [env: string]: BrowserslistQuery | ReadonlyArray<BrowserslistQuery> } = {
    production: ['>0.2%', 'not dead', 'not op_mini all'],
    development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
};

export default browserslist;
