# Export From JSON

[![Greenkeeper badge](https://badges.greenkeeper.io/zheeeng/export-from-json.svg)](https://greenkeeper.io/)

[![language](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](http://typescriptlang.org/)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Build Status](https://travis-ci.org/zheeeng/export-from-json.svg?branch=master)](https://travis-ci.org/zheeeng/export-from-json)
[![NPM version](https://img.shields.io/npm/v/export-from-json.svg)](https://www.npmjs.com/package/export-from-json)

Export and download plain text, json, csv, xls file from valid JavaScript JSON object.

## Installation

```sh
yarn add export-from-json
```

or


```sh
npm i --save export-from-json
```

## Usage

In Module system:

```javascript
import exportFromJSON from 'export-from-json'

const data = [{ foo: 'foo'}, { bar: 'bar' }]
const fileName = 'download'
const exportType = 'csv'

exportFromJSON({ data, fileName, exportType })
```

In browser: [codepen example](https://codepen.io/zheeeng/pen/PQxBKr)

```javascript
<script src="path/to/yourCopyOf/exportFromJSON.min.js"></script>
<script>
    const data = [{ foo: 'foo'}, { bar: 'bar' }]
    const fileName = 'download'
    const exportType = 'csv'

    window.exportFromJSON({ data, fileName, exportType })
</script>
```

## Types

| Option name | Required | Type | Description
| ----------- | -------- | ---- | ----
| data        | true     | `Array<JSON>` or `JSON` | 'txt' and 'json' export types support any valid JSON data. 'csv' and 'xls' export types support only JSON array.
| fileName    | false    | string | filename without extension
| exportType  | false    | Enum | 'txt', 'json', 'csv', 'xls'`
