/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/interfaces'

export default class Auth {
  private googleAuth: any;

  constructor (googleAuth: any) {
    this.googleAuth = googleAuth
  }

  authInstance () {
    return this.googleAuth.getAuthInstance()
  }

  signIn () {
    return this.authInstance().signIn()
  }

  listen (listener: Function) {
    this.authInstance().currentUser.listen((googleUser: any) => {
      const user: User | undefined = googleUser.isSignedIn()
        ? this.mapUser(googleUser.getBasicProfile())
        : undefined

      listener(user)
    })
  }

  signOut () {
    return this.authInstance().signOut()
  }

  currentGoogleUser () {
    return this.authInstance().currentUser.get()
  }

  userId (): string {
    return this.currentGoogleUser().getId()
  }

  isAuthenticated (): boolean {
    if (!this.authInstance()) {
      return false
    }

    return this.authInstance().isSignedIn.get()
  }

  mapUser (googleUserBasicProfile: any): User {
    return {
      id: googleUserBasicProfile.getId() as string,
      name: googleUserBasicProfile.getName() as string,
      photoUrl: googleUserBasicProfile.getImageUrl() as string,
      email: googleUserBasicProfile.getEmail() as string
    }
  }

  user (): User | undefined {
    if (!this.isAuthenticated()) {
      return undefined
    }

    return this.mapUser(this.currentGoogleUser().getBasicProfile())
  }
}
