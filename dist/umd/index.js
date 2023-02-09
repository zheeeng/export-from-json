(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.exportFromJSON = factory());
})(this, (function () { 'use strict';

  function isArray(data) {
      return Object.prototype.toString.call(data) === '[object Array]';
  }
  function assert(condition, msg) {
      if (!condition)
          throw new Error(msg);
  }
  function getKeys(data) {
      return Object.keys(data);
  }
  function getEntries(data) {
      return Object.keys(data).map(function (key) { return [key, data[key]]; });
  }
  function normalizeFileName(fileName, extension, fileNameFormatter) {
      var suffix = '.' + extension;
      var extensionPattern = new RegExp("(\\".concat(extension, ")?$"));
      return fileNameFormatter(fileName).replace(extensionPattern, suffix);
  }
  function normalizeXMLName(name) {
      '555xmlHello .  world!'.trim().replace(/^([0-9,;]|(xml))+/, '');
      return name.replace(/[^_a-zA-Z 0-9:\-\.]/g, '').replace(/^([ 0-9-:\-\.]|(xml))+/i, '').replace(/ +/g, '-');
  }
  function indent(spaces) {
      return Array(spaces + 1).join(' ');
  }
  function stripHTML(text) {
      return text.replace(/([<>&])/g, function (_, $1) {
          switch ($1) {
              case '<': return '&lt;';
              case '>': return '&gt;';
              case '&': return '&amp;';
              default: return '';
          }
      });
  }

  function generateDataURI(content, type, byBlob) {
      switch (type) {
          case 'txt': {
              var blobType = 'text/plain;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          case 'css': {
              var blobType = 'text/css;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          case 'html': {
              var blobType = 'text/html;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          case 'json': {
              var blobType = 'text/json;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          case 'csv': {
              var blobType = 'text/csv;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          case 'xls': {
              var blobType = 'text/application/vnd.ms-excel;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          case 'xml': {
              var blobType = 'text/application/xml;charset=utf-8';
              if (byBlob)
                  return URL.createObjectURL(new Blob([content], { type: blobType }));
              return "data:,".concat(blobType) + encodeURIComponent(content);
          }
          default: {
              return '';
          }
      }
  }
  function downloadFile(content, type, fileName, byBlob) {
      if (fileName === void 0) { fileName = 'download'; }
      if (byBlob === void 0) { byBlob = true; }
      var dataURI = generateDataURI(content, type, byBlob);
      var anchor = document.createElement('a');
      anchor.href = dataURI;
      anchor.download = fileName;
      anchor.setAttribute('style', 'visibility:hidden');
      document.body.appendChild(anchor);
      anchor.dispatchEvent(new MouseEvent('click', {
          bubbles: false,
          cancelable: false,
          view: window,
      }));
      document.body.removeChild(anchor);
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  function _createFieldsMapper(fields) {
      if (!fields
          || isArray(fields) && !fields.length
          || !isArray(fields) && !getKeys(fields).length)
          return function (item) { return item; };
      var mapper = isArray(fields)
          ? fields.reduce(function (map, key) {
              var _a;
              return (__assign(__assign({}, map), (_a = {}, _a[key] = key, _a)));
          }, Object.create(null))
          : fields;
      return function (item) {
          if (isArray(item)) {
              return item
                  .map(function (i) { return getEntries(i).reduce(function (map, _a) {
                  var _b = __read(_a, 2), key = _b[0], value = _b[1];
                  if (key in mapper) {
                      map[mapper[key]] = value;
                  }
                  return map;
              }, Object.create(null)); })
                  .filter(function (i) { return getKeys(i).length; });
          }
          return getEntries(item).reduce(function (map, _a) {
              var _b = __read(_a, 2), key = _b[0], value = _b[1];
              if (key in mapper) {
                  map[mapper[key]] = value;
              }
              return map;
          }, Object.create(null));
      };
  }
  function _prepareData(data) {
      var MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON';
      try {
          return (typeof data === 'string' ? JSON.parse(data) : data);
      }
      catch (_a) {
          throw new Error(MESSAGE_VALID_JSON_FAIL);
      }
  }
  function _createJSONData(data, replacer, space) {
      if (replacer === void 0) { replacer = null; }
      var MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide valid JSON object';
      try {
          return JSON.stringify(data, replacer, space);
      }
      catch (_a) {
          throw new Error(MESSAGE_VALID_JSON_FAIL);
      }
  }
  function _createTableMap(data) {
      return data.map(getEntries).reduce(function (tMap, rowKVs, rowIndex) {
          return rowKVs.reduce(function (map, _a) {
              var _b = __read(_a, 2), key = _b[0], value = _b[1];
              var columnValues = map[key] || Array.from({ length: data.length }).map(function (_) { return ''; });
              columnValues[rowIndex] =
                  (typeof value !== 'string' ? JSON.stringify(value) : value) || '';
              map[key] = columnValues;
              return map;
          }, tMap);
      }, Object.create(null));
  }
  function _createTableEntries(tableMap, beforeTableEncode) {
      if (beforeTableEncode === void 0) { beforeTableEncode = function (i) { return i; }; }
      return beforeTableEncode(getEntries(tableMap).map(function (_a) {
          var _b = __read(_a, 2), fieldName = _b[0], fieldValues = _b[1];
          return ({
              fieldName: fieldName,
              fieldValues: fieldValues,
          });
      }));
  }
  function encloser(value) {
      var enclosingCharacter = /,|"|\n/.test(value) ? '"' : '';
      var escaped = value.replace(/"/g, '""');
      return "".concat(enclosingCharacter).concat(escaped).concat(enclosingCharacter);
  }
  function createCSVData(data, beforeTableEncode) {
      if (beforeTableEncode === void 0) { beforeTableEncode = function (i) { return i; }; }
      if (!data.length)
          return '';
      var tableMap = _createTableMap(data);
      var tableEntries = _createTableEntries(tableMap, beforeTableEncode);
      var head = tableEntries.map(function (_a) {
          var fieldName = _a.fieldName;
          return fieldName;
      }).join(',') + '\r\n';
      var columns = tableEntries.map(function (_a) {
          var fieldValues = _a.fieldValues;
          return fieldValues;
      })
          .map(function (column) { return column.map(encloser); });
      var rows = columns.reduce(function (mergedColumn, column) { return mergedColumn.map(function (value, rowIndex) { return "".concat(value, ",").concat(column[rowIndex]); }); });
      return head + rows.join('\r\n');
  }
  function _renderTableHTMLText(data, beforeTableEncode) {
      assert(data.length > 0);
      var tableMap = _createTableMap(data);
      var tableEntries = _createTableEntries(tableMap, beforeTableEncode);
      var head = tableEntries.map(function (_a) {
          var fieldName = _a.fieldName;
          return fieldName;
      })
          .join('</b></th><th><b>');
      var columns = tableEntries.map(function (_a) {
          var fieldValues = _a.fieldValues;
          return fieldValues;
      })
          .map(function (column) { return column.map(function (value) { return "<td>".concat(value, "</td>"); }); });
      var rows = columns.reduce(function (mergedColumn, column) { return mergedColumn
          .map(function (value, rowIndex) { return "".concat(value).concat(column[rowIndex]); }); });
      return "\n    <table>\n      <thead>\n        <tr><th><b>".concat(head, "</b></th></tr>\n      </thead>\n      <tbody>\n        <tr>").concat(rows.join("</tr>\n        <tr>"), "</tr>\n      </tbody>\n    </table>\n  ");
  }
  function createXLSData(data, beforeTableEncode) {
      if (beforeTableEncode === void 0) { beforeTableEncode = function (i) { return i; }; }
      if (!data.length)
          return '';
      var content = "<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n  </head >\n  <body>\n    ".concat(_renderTableHTMLText(data, beforeTableEncode), "\n  </body>\n</html >\n");
      return content;
  }
  function createXMLData(data) {
      var content = "<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE base>\n".concat(_renderXML(data, 'base'), "\n");
      return content;
  }
  function _renderXML(data, tagName, arrayElementTag, spaces) {
      if (arrayElementTag === void 0) { arrayElementTag = 'element'; }
      if (spaces === void 0) { spaces = 0; }
      var tag = normalizeXMLName(tagName);
      var indentSpaces = indent(spaces);
      if (data === null || data === undefined) {
          return "".concat(indentSpaces, "<").concat(tag, " />");
      }
      var content = isArray(data)
          ? data.map(function (item) { return _renderXML(item, arrayElementTag, arrayElementTag, spaces + 2); }).join('\n')
          : typeof data === 'object'
              ? getEntries(data)
                  .map(function (_a) {
                  var _b = __read(_a, 2), key = _b[0], value = _b[1];
                  return _renderXML(value, key, arrayElementTag, spaces + 2);
              }).join('\n')
              : indentSpaces + '  ' + stripHTML(String(data));
      var contentWithWrapper = "".concat(indentSpaces, "<").concat(tag, ">\n").concat(content, "\n").concat(indentSpaces, "</").concat(tag, ">");
      return contentWithWrapper;
  }

  var exportTypes = {
      txt: 'txt',
      css: 'css',
      html: 'html',
      json: 'json',
      csv: 'csv',
      xls: 'xls',
      xml: 'xml',
  };

  function exportFromJSON(_a) {
      var data = _a.data, _b = _a.fileName, fileName = _b === void 0 ? 'download' : _b, extension = _a.extension, _c = _a.fileNameFormatter, fileNameFormatter = _c === void 0 ? function (name) { return name.replace(/\s+/, '_'); } : _c, fields = _a.fields, _d = _a.exportType, exportType = _d === void 0 ? 'txt' : _d, _e = _a.replacer, replacer = _e === void 0 ? null : _e, _f = _a.space, space = _f === void 0 ? 4 : _f, _g = _a.processor, processor = _g === void 0 ? downloadFile : _g, _h = _a.withBOM, withBOM = _h === void 0 ? false : _h, _j = _a.beforeTableEncode, beforeTableEncode = _j === void 0 ? function (i) { return i; } : _j;
      var MESSAGE_IS_ARRAY_FAIL = 'Invalid export data. Please provide an array of objects';
      var MESSAGE_UNKNOWN_EXPORT_TYPE = "Can't export unknown data type ".concat(exportType, ".");
      var MESSAGE_FIELD_INVALID = "Can't export string data to ".concat(exportType, ".");
      if (typeof data === 'string') {
          switch (exportType) {
              case 'txt':
              case 'css':
              case 'html': {
                  return processor(data, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : exportType, fileNameFormatter));
              }
              default:
                  throw new Error(MESSAGE_FIELD_INVALID);
          }
      }
      var fieldsMapper = _createFieldsMapper(fields);
      var safeData = fieldsMapper(_prepareData(data));
      var JSONData = _createJSONData(safeData, replacer, space);
      switch (exportType) {
          case 'txt':
          case 'css':
          case 'html': {
              return processor(JSONData, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : exportType, fileNameFormatter));
          }
          case 'json': {
              return processor(JSONData, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'json', fileNameFormatter));
          }
          case 'csv': {
              assert(isArray(safeData), MESSAGE_IS_ARRAY_FAIL);
              var BOM = '\ufeff';
              var CSVData = createCSVData(safeData, beforeTableEncode);
              var content = withBOM ? BOM + CSVData : CSVData;
              return processor(content, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'csv', fileNameFormatter));
          }
          case 'xls': {
              assert(isArray(safeData), MESSAGE_IS_ARRAY_FAIL);
              var content = createXLSData(safeData, beforeTableEncode);
              return processor(content, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'xls', fileNameFormatter));
          }
          case 'xml': {
              var content = createXMLData(safeData);
              return processor(content, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'xml', fileNameFormatter));
          }
          default:
              throw new Error(MESSAGE_UNKNOWN_EXPORT_TYPE);
      }
  }
  exportFromJSON.types = exportTypes;
  exportFromJSON.processors = { downloadFile: downloadFile };

  return exportFromJSON;

}));
