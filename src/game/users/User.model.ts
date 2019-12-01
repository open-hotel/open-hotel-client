export class User {
  id: string
  name: string
  motto: string
  look: string

  constructor (data: Partial<User>) {
    Object.assign(this, data)
  }
}