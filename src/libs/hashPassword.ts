import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

class HashPassword {
  static generate(password: string) {
    const salt = genSaltSync(10)
    return hashSync(password, salt)
  }
  static compare(password: string, hash: string) {
    return compareSync(password, hash)
  }
}
export default HashPassword
