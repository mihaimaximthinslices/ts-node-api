import { HashMethods } from '../../../../domain/shared'
import bcrypt from 'bcrypt'

export const makeHashMethods = (): HashMethods => {
  return {
    async hash(password: string): Promise<string> {
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err)
          } else {
            resolve(hash)
          }
        })
      })
    },

    async compare(password: string, hashedPassword: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    },
  }
}
