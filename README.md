# react-docgen-loader

基于 react-docgen 的 webpack loader，只支持使用内联模式使用，返回 react 组件注释对象，结构请参考 [react-docgen](https://github.com/reactjs/react-docgen) 。

### 安装

```sh
npm i react-docen-webpack-loader
```

### 使用

目前只支持 webpack loader 内联使用方式。

```js
import docData from '!!react-docgen-webpack-loader!../shared-components/src/QueryForm/Select';
// 或者 const docData = require('!!react-docgen-webpack-loader!../shared-components/src/QueryForm/Select')
```

可以配合 mdx 组件使用来生成属性表格。

```md
---
id: select
title: Select
subTitle: 选择器
---

import PropsTable from '@theme/PropsTable';
import docData from '!!react-docgen-loader!../shared-components/src/QueryForm/Select';

## Select Props

<PropsTable data={docData} />
```
