export declare function _createFieldsMapper(fields?: string[] | Record<string, string>): (item: Record<string, unknown> | Array<Record<string, unknown>>) => Record<string, unknown> | Record<string, unknown>[];
export declare function _prepareData(data: object | string): Record<string, unknown>;
export declare function _createJSONData(data: object, replacer: (string | number)[] | ((key: string, value: any) => any) | null | undefined, space: string | number): string;
export interface ITableMap {
    [key: string]: string[];
}
export declare function _createTableMap(data: any[]): ITableMap;
export interface ITableEntries extends Array<{
    fieldName: string;
    fieldValues: string[];
}> {
}
export declare function _createTableEntries(tableMap: ITableMap, beforeTableEncode?: (entries: ITableEntries) => ITableEntries): ITableEntries;
export declare function createCSVData(data: any[], beforeTableEncode?: (entries: ITableEntries) => ITableEntries, separator?: string): string;
export declare function _renderTableHTMLText(data: any[], beforeTableEncode: (entries: ITableEntries) => ITableEntries): string;
export declare function createXLSData(data: any[], beforeTableEncode?: (entries: ITableEntries) => ITableEntries): string;
export declare function createXMLData(data: object): string;
