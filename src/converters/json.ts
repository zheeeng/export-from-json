import { Converter } from '../interface'

enum ErrorType {
  MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON'
}

export const JsonConverter: Converter<void> = {
  matcher () { return true },
  converter (data) {
    return JSON.stringify(data)
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
