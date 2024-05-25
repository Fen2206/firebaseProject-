const functions = require("firebase-functions");
const admin = require("firebase-admin");


// Initialize Firebase Admin SDK
admin.initializeApp();


exports.addMessage = functions.https.onCall(async (data) => {
  try {
    // Validate required data
    if (!data.text || !data.userId) {
      console.error("Required fields (text or userId) are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (text or userId) are missing",
      );
    }


    const {text, userId} = data;


    // Construct message data
    const messageData = {
      text,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };


    // Add message to user's message subcollection in Firestore
    const messageRef = await admin
        .firestore()
        .collection("chats")
        .doc(userId)
        .collection("messages")
        .add(messageData);


    console.log(`Message added successfully, message ID: ${messageRef.id}`);


    // Return success status and message ID
    return {status: "success", messageId: messageRef.id};
  } catch (error) {
    console.error(`Error adding message: ${error}`);


    // Throw a structured error for the client
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while adding the message",
        error.message,
    );
  }
});
