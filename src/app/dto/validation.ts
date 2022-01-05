import * as Yup from 'yup'

interface ErrorMessage {
  [key: string]: string[]
}

export const mapValidation = (err: Yup.ValidationError) => {
  return err.inner.reduce(
    (
      result: ErrorMessage,
      { path, message, ...props }: Yup.ValidationError
    ) => {
      if (path && !result[path]) {
        result[path] = [message]
      }
      return result
    },
    {}
  )
}
