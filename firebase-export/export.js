const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(name) {
  const snapshot = await db.collection(name).get();
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  fs.writeFileSync(`${name}.json`, JSON.stringify(data, null, 2));
  console.log(`Exported ${name}`);
}

(async () => {
  await exportCollection("users");
  await exportCollection("submissions");
  await exportCollection("reviewAssignments");
  await exportCollection("reviews");
  await exportCollection("reviewerRequests");
})();