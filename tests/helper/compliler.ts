import fs from 'fs';
import webpack from 'webpack';
import loader from '../../src/index';

export default (entry: string) => {
  const source = fs.readFileSync(entry, { encoding: 'utf-8' });

  return loader.bind(({
    resourcePath: entry,
  } as unknown) as webpack.loader.LoaderContext)(source);
};
