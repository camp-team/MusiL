import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserData } from 'functions/src/interfaces/user';
import { auth } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
  ) { }

  getUserData(uid: string): Observable<UserData> {
    return this.db.doc<UserData>(`users/${uid}`).valueChanges();
  }

  getUserByScreenName(screenName: string): Observable<UserData> {
    return this.db
      .collection<UserData>('users', ref => ref.where('screenName', '==', screenName))
      .valueChanges()
      .pipe(
        map(users => {
          if (users.length) {
            return users[0];
          } else {
            return null;
          }
        })
      );
  }

  async createUser(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();
    const userCredential = await this.afAuth.signInWithPopup(provider);
    const { user, additionalUserInfo } = userCredential;
    const userProfObj = JSON.parse(JSON.stringify(additionalUserInfo.profile));
    const userData: UserData = {
      uid: user.uid,
      userName: userProfObj.name,
      avatarURL: userProfObj.profile_image_url_https.replace('_normal', ''),
      screenName: userProfObj.screen_name,
      description: userProfObj.description,
    };
    return this.db.doc<UserData>(`users/${user.uid}`).set(userData);
  }

  async updateUser(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();
    const userCredential = await this.afAuth.signInWithPopup(provider);
    const { user, additionalUserInfo } = userCredential;
    const userProfObj = JSON.parse(JSON.stringify(additionalUserInfo.profile));
    const userData: Pick<UserData, 'screenName'> = {
      screenName: userProfObj.screen_name,
    };
    return this.db.doc<UserData>(`users/${user.uid}`).update(userData);
  }

  async uploadAvatar(uid: string, avatar: string): Promise<void> {
    const time: number = new Date().getTime();
    const result = await this.storage.ref(`users/${uid}/avatar/${time}`).putString(avatar, 'data_url');
    const avatarURL = await result.ref.getDownloadURL();
    return this.db.doc<UserData>(`users/${uid}`).update({ avatarURL });
  }

  changeUserData(uid: string, newUserData: Pick<UserData, 'userName' | 'description'>): Promise<void> {
    return this.db.doc<UserData>(`users/${uid}`).update(newUserData);
  }

  async deleteUser(): Promise<void> {
    return (await this.afAuth.currentUser).delete();
  }
}
