export type Json =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonArray

export interface JsonObject {
    [property: string]: Json
}

export interface JsonArray extends Array<Json> {}

export interface Converter<O> {
    matcher (data: Json, option: O): boolean
    converter (data: Json, option: O): string
    error (err: any, converter: Converter<O>['converter'], data: Json, option: O): string
}
