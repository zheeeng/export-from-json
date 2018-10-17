<h1 align="center">Export From JSON</h1>

<div align="center">

Export to plain text, json, csv, xls files from JSON.

[![Greenkeeper badge](https://badges.greenkeeper.io/zheeeng/export-from-json.svg)](https://greenkeeper.io/)
[![language](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](http://typescriptlang.org/)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Build Status](https://travis-ci.org/zheeeng/export-from-json.svg?branch=master)](https://travis-ci.org/zheeeng/export-from-json)
[![npm version](https://img.shields.io/npm/v/export-from-json.svg)](https://www.npmjs.com/package/export-from-json)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/export-from-json.svg)](https://unpkg.com/export-from-json/dist/umd/index.min.js)

[![NPM](https://nodei.co/npm/export-from-json.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/export-from-json/)

</div>

## Installation

```sh
yarn add export-from-json
```

or


```sh
npm i --save export-from-json
```

## Usage

`exportFromJSON` support CommonJS, EcmaScript Module, UMD importing.

`exportFromJSON` takes options as the [Types Chapter](#types) demonstrated, and it uses a [front-end downloader](https://github.com/zheeeng/export-from-json/blob/master/src/processors.ts) as the default processor option. In browser environment, there is a file content size limitation on the default processor, you can consider using a [server side solution](#in-nodejs-serverr) by passing a custom processor.

### In module system

```javascript
import exportFromJSON from 'export-from-json'

const data = [{ foo: 'foo'}, { bar: 'bar' }]
const fileName = 'download'
const exportType = 'csv'

exportFromJSON({ data, fileName, exportType })
```

### In browser

Check the [codepen example](https://codepen.io/zheeeng/pen/PQxBKr)

```javascript
<script src="https://unpkg.com/export-from-json/dist/umd/index.min.js"></script>
<script>
    const data = [{ foo: 'foo'}, { bar: 'bar' }]
    const fileName = 'download'
    const exportType = 'csv'

    window.exportFromJSON({ data, fileName, exportType })
</script>
```

### In Node.js server

`exportFromJSON` returns what the `processor` option returns, we can consider such a server side usage for providing converting/downloading service:

```javascript
const http = require('http')
const exportFromJSON = require('export-from-json')

http.createServer(function (request, response){
    // exportFromJSON actually supports passing JSON as the data option. It's very common that reading it from http request directly.
    const data = '[{"foo":"foo"},{"bar":"bar"}]'
    const fileName = 'download'
    const exportType = 'txt'

    const result = exportFromJSON({
        data,
        fileName,
        exportType,
        processor (content, type, fileName) {
            switch (type) {
                case 'txt':
                    response.setHeader('Content-Type', 'text/plain')
                    break
                case 'json':
                    response.setHeader('Content-Type', 'text/plain')
                    break
                case 'csv':
                    response.setHeader('Content-Type', 'text/csv')
                    break
                case 'xls':
                    response.setHeader('Content-Type', 'application/vnd.ms-excel')
                    break
            }
            response.setHeader('Content-disposition', 'attachment;filename=' + fileName)
            return content
        }
    })

    response.write(result)
    response.end()
}).listen(8080, '127.0.0.1')
```

## Types

**Note:** `JSON` here refers to parsable JSON string or a serializable JavaScript object.

| Option name | Required | Type | Description
| ----------- | -------- | ---- | ----
| data        | true     | `Array<JSON>` or `JSON` | If the exportType is 'txt' or 'json', data can be any parsable JSON. If the exportType is 'csv' or 'xls', data can only be an array of parsable JSON.
| fileName    | false    | string | filename without extension, default to 'download'
| exportType  | false    | Enum ExportType | 'txt'(default), 'json', 'csv', 'xls'`
| processor   | false    | (content: string, type: ExportType, fileName: string) => any | default to a front-end downloader
| withBOM     | false    | boolean | Add BOM(byte order mark) meta to CSV file. BOM is expected by `Excel` when reading UTF8 CSV file. It is default to false.

You can also reference these export types through a mounted field `types`:

```js
exportFromJSON({ data: jsonData, fileName: 'data', exportType: exportFromJSON.types.csv })
```
