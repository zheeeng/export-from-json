import { downloadFile } from './processors.js';
import { ExportType } from './types.js';
export interface IOption<R = void> {
    data: object | string;
    fileName?: string;
    extension?: string;
    fileNameFormatter?: (name: string) => string;
    fields?: string[] | Record<string, string>;
    exportType?: ExportType;
    replacer?: ((key: string, value: any) => any) | Array<number | string> | null;
    space?: string | number;
    processor?: (content: string, type: ExportType, fileName: string) => R;
    withBOM?: boolean;
    beforeTableEncode?: (tableRow: Array<{
        fieldName: string;
        fieldValues: string[];
    }>) => Array<{
        fieldName: string;
        fieldValues: string[];
    }>
    separator?: string;
}
declare function exportFromJSON<R = void>({ data, fileName, extension, fileNameFormatter, fields, exportType, replacer, space, processor, withBOM, beforeTableEncode, separator,}: IOption<R>): R;
declare namespace exportFromJSON {
    var types: {
        html: "html";
        json: "json";
        txt: "txt";
        csv: "csv";
        xls: "xls";
        xml: "xml";
        css: "css";
    };
    var processors: {
        downloadFile: typeof downloadFile;
    };
}
export default exportFromJSON;
