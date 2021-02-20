import admin from 'firebase-admin';
import key from './firebaseKey';

if (admin.apps.length < 1)
admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

export const db = admin.firestore();
export const auth = admin.auth();
export const fieldValue = admin.firestore.FieldValue;