import { isArray, getEntries, normalizeXMLName, indent, stripHTML, assert, getKeys } from './utils.js';
export function _createFieldsMapper(fields) {
    if (!fields
        || isArray(fields) && !fields.length
        || !isArray(fields) && !getKeys(fields).length)
        return (item) => item;
    const mapper = isArray(fields)
        ? fields.reduce((map, key) => (Object.assign(Object.assign({}, map), { [key]: key })), Object.create(null))
        : fields;
    return (item) => {
        if (isArray(item)) {
            return item
                .map(i => getEntries(i).reduce((map, [key, value]) => {
                if (key in mapper) {
                    map[mapper[key]] = value;
                }
                return map;
            }, Object.create(null)))
                .filter(i => getKeys(i).length);
        }
        return getEntries(item).reduce((map, [key, value]) => {
            if (key in mapper) {
                map[mapper[key]] = value;
            }
            return map;
        }, Object.create(null));
    };
}
export function _prepareData(data) {
    const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON';
    try {
        return (typeof data === 'string' ? JSON.parse(data) : data);
    }
    catch (_a) {
        throw new Error(MESSAGE_VALID_JSON_FAIL);
    }
}
export function _createJSONData(data, replacer = null, space) {
    const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide valid JSON object';
    try {
        return JSON.stringify(data, replacer, space);
    }
    catch (_a) {
        throw new Error(MESSAGE_VALID_JSON_FAIL);
    }
}
export function _createTableMap(data) {
    return data.map(getEntries).reduce((tMap, rowKVs, rowIndex) => rowKVs.reduce((map, [key, value]) => {
        const columnValues = map[key] || Array.from({ length: data.length }).map(_ => '');
        columnValues[rowIndex] =
            (typeof value !== 'string' ? JSON.stringify(value) : value) || '';
        map[key] = columnValues;
        return map;
    }, tMap), Object.create(null));
}
export function _createTableEntries(tableMap, beforeTableEncode = i => i) {
    return beforeTableEncode(getEntries(tableMap).map(([fieldName, fieldValues]) => ({
        fieldName,
        fieldValues,
    })));
}
function encloser(value) {
    const enclosingCharacter = /,|"|\n/.test(value) ? '"' : '';
    const escaped = value.replace(/"/g, '""');
    return `${enclosingCharacter}${escaped}${enclosingCharacter}`;
}
export function createCSVData(data, beforeTableEncode = i => i) {
    if (!data.length)
        return '';
    const tableMap = _createTableMap(data);
    const tableEntries = _createTableEntries(tableMap, beforeTableEncode);
    const head = tableEntries.map(({ fieldName }) => fieldName).join(',') + '\r\n';
    const columns = tableEntries.map(({ fieldValues }) => fieldValues)
        .map(column => column.map(encloser));
    const rows = columns.reduce((mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value},${column[rowIndex]}`));
    return head + rows.join('\r\n');
}
export function _renderTableHTMLText(data, beforeTableEncode) {
    assert(data.length > 0);
    const tableMap = _createTableMap(data);
    const tableEntries = _createTableEntries(tableMap, beforeTableEncode);
    const head = tableEntries.map(({ fieldName }) => fieldName)
        .join('</b></th><th><b>');
    const columns = tableEntries.map(({ fieldValues }) => fieldValues)
        .map(column => column.map(value => `<td>${value}</td>`));
    const rows = columns.reduce((mergedColumn, column) => mergedColumn
        .map((value, rowIndex) => `${value}${column[rowIndex]}`));
    return `
    <table>
      <thead>
        <tr><th><b>${head}</b></th></tr>
      </thead>
      <tbody>
        <tr>${rows.join(`</tr>
        <tr>`)}</tr>
      </tbody>
    </table>
  `;
}
export function createXLSData(data, beforeTableEncode = i => i) {
    if (!data.length)
        return '';
    const content = `<html>
  <head>
    <meta charset="UTF-8" />
  </head >
  <body>
    ${_renderTableHTMLText(data, beforeTableEncode)}
  </body>
</html >
`;
    return content;
}
export function createXMLData(data) {
    const content = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE base>
${_renderXML(data, 'base')}
`;
    return content;
}
function _renderXML(data, tagName, arrayElementTag = 'element', spaces = 0) {
    const tag = normalizeXMLName(tagName);
    const indentSpaces = indent(spaces);
    if (data === null || data === undefined) {
        return `${indentSpaces}<${tag} />`;
    }
    const content = isArray(data)
        ? data.map(item => _renderXML(item, arrayElementTag, arrayElementTag, spaces + 2)).join('\n')
        : typeof data === 'object'
            ? getEntries(data)
                .map(([key, value]) => _renderXML(value, key, arrayElementTag, spaces + 2)).join('\n')
            : indentSpaces + '  ' + stripHTML(String(data));
    const contentWithWrapper = `${indentSpaces}<${tag}>
${content}
${indentSpaces}</${tag}>`;
    return contentWithWrapper;
}
