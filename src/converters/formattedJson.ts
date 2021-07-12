import { Converter } from '../interface'

export interface JsonOption {
  replacer?: ((key: string, value: any) => any) | Array<number | string> | null,
  space?: string | number
}

enum ErrorType {
  MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON'
}

export const JsonConverter: Converter<JsonOption> = {
  matcher () { return true },
  converter (data, { replacer, space  }) {
    return JSON.stringify(data, replacer, space)
  },
  error (err: ErrorType) {
    switch (err) {
      case ErrorType.MESSAGE_VALID_JSON_FAIL:
        return err
      default:
        return 'unknown error'
    }
  },
}

