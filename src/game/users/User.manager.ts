import { User } from "./User.model";

export class UserManager {
  users: Map<string, User> = new Map()
  currentUser: User

  setUser (userInfo: Partial<User>) {
    
    if (this.users.has(userInfo.id)) {
      const user = this.users.get(userInfo.id)
      Object.assign(user, userInfo)
      return user
    }
    
    const user = new User(userInfo)

    this.users.set(user.id, user)
    
    return user
  }

  getUser (id: string) {
    return this.users.get(id)
  }

  setCurrentUser (user:User) {
    this.currentUser = this.setUser(user)
    return this.currentUser
  }
}