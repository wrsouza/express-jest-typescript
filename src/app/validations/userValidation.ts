import * as Yup from 'yup'
import { ValidationError } from '~/errors'
import { mapValidation } from '~/app/dto'
import { isValidObjectId } from 'mongoose'

const userSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required').email('Invalid Email'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Minimum of 6 characters')
    .max(20, 'Maximum of 20 characters')
})

interface UserStore {
  id?: string
  name: string
  email: string
  password: string
}

export class UserValidation {
  schemaStore: typeof userSchema

  constructor() {
    this.schemaStore = userSchema
  }

  async validateStore(data: UserStore) {
    return this.schemaStore
      .validate(data, { abortEarly: false })
      .catch((err) => {
        throw new ValidationError(mapValidation(err))
      })
  }

  validateFindById(id: string) {
    if (!isValidObjectId(id)) {
      throw new ValidationError({ id: ['User Id invalid'] })
    }
  }
}
