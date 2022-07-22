const admin = require('firebase-admin')
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://****.firebaseio.com',
  })
}
exports.db = admin.firestore()
