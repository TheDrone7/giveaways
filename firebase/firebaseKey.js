import { config } from 'dotenv';
config();

export default {
  "type": "service_account",
  "project_id": "nx-giveaway",
  "private_key_id": "e30bbe42c1824048daf808a467d4746d631257c9",
  "private_key": process.env.firebaseKey,
  "client_email": "firebase-adminsdk-wnoi2@nx-giveaway.iam.gserviceaccount.com",
  "client_id": "105223056857024786375",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wnoi2%40nx-giveaway.iam.gserviceaccount.com"
}