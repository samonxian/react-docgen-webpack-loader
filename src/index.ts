import webpack from 'webpack';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const reactDocs = require('react-docgen');

export default function reactDocGenLoader(this: webpack.loader.LoaderContext, source: string) {
  // 是否是 ts
  let isTs = false;

  if (this.resourcePath.includes('.ts')) {
    isTs = true;
  }

  let genDocObject;

  try {
    genDocObject = getReactDocData(source, isTs);
  } catch (e) {
    console.error(`请检查文件 ${this.resourcePath} 内容是否符合 props 文档生成规则。`);
    throw e;
  }

  genDocObject.isTypeScript = isTs;

  return `module.exports = ${JSON.stringify(genDocObject, null, 2)}`;
}

/**
 * 使用 react-docgen 获取 js 文件符合规范的文档数据。
 *
 * @param 需要解析的 react-docgen 文件源，即 js 或者 ts 文件。
 * @param isTypescript 是否为 ts
 */
export function getReactDocData(source: string, isTypescript: boolean) {
  const defaultPlugins = [
    'jsx',
    'asyncGenerators',
    'bigInt',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    ['decorators', { decoratorsBeforeExport: false }],
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importMeta',
    'logicalAssignment',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    ['pipelineOperator', { proposal: 'minimal' }],
    'throwExpressions',
    'topLevelAwait',
  ];
  const docParseOptions = {
    filename: 'react',
    babelrc: false,
    babelrcRoots: false,
    configFile: false,
    parserOptions: {
      plugins: [...defaultPlugins],
    },
  };

  if (isTypescript) {
    docParseOptions.parserOptions.plugins.push('typescript');
  }

  return reactDocs.parse(source, reactDocs.resolver.findExportedComponentDefinition, null, docParseOptions);
}
