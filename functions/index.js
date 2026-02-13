const { onCall } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore();

/* ===============================
   GLOBAL OPTIONS
================================ */

setGlobalOptions({
  region: "us-central1",
  maxInstances: 5,
});

/* ===============================
   EMAIL TRANSPORT
================================ */

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASSWORD,

  },

});

/* ===============================
   GENERATE MANUSCRIPT ID
================================ */

async function generateManuscriptId() {

  const year = new Date().getFullYear();

  const prefix = `TOESS-${year}-`;

  const snapshot = await db
    .collection("submissions")
    .where("manuscriptId", ">=", prefix)
    .where("manuscriptId", "<", `TOESS-${year + 1}-`)
    .orderBy("manuscriptId", "desc")
    .limit(1)
    .get();

  if (snapshot.empty)
    return `${prefix}0001`;

  const lastId =
    snapshot.docs[0].data().manuscriptId;

  const lastNumber =
    parseInt(lastId.split("-")[2]);

  const newNumber = lastNumber + 1;

  return `${prefix}${newNumber
    .toString()
    .padStart(4, "0")}`;

}

/* ===============================
   MAIN FUNCTION
================================ */

exports.submitManuscript = onCall(
  {
    secrets: ["EMAIL_USER", "EMAIL_PASSWORD"],
  },

  async (request) => {

    try {

      const data = request.data;

      const auth = request.auth;

      if (!auth)
        throw new Error("Not authenticated");

      const manuscriptId =
        await generateManuscriptId();

      const docRef =
        await db.collection("submissions").add({

          manuscriptId,

          ...data,

          authorId: auth.uid,

          status: "submitted",

          createdAt:
            admin.firestore.FieldValue.serverTimestamp(),

        });

      /* SEND EMAIL */

      await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: data.authorEmail,

        subject:
          "Manuscript Submitted: " +
          manuscriptId,

        html: `
          <h2>Submission Successful</h2>

          <p>Your Manuscript ID:</p>

          <h3>${manuscriptId}</h3>

          <p>Keep this for future reference.</p>
        `,

      });

      return {

        success: true,

        manuscriptId,

        submissionId: docRef.id,

      };

    }

    catch (error) {

      console.error(error);

      throw new Error(error.message);

    }

  }
);
