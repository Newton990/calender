const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Trigger: When a new message is added to chats/{chatId}/messages/{messageId}
exports.sendMessageNotification = functions.firestore
    .document('chats/{chatId}/messages/{messageId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const receiverId = data.receiverId;

        // 1. Fetch recipient's FCM token from the users collection
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(receiverId)
            .get();

        if (!userDoc.exists) {
            console.error(`PUSH: User ${receiverId} not found.`);
            return null;
        }

        const token = userDoc.data().fcmToken;
        if (!token) {
            console.warn(`PUSH: No FCM token for user ${receiverId}.`);
            return null;
        }

        // 2. Send the push notification
        const payload = {
            token: token,
            notification: {
                title: "New Message 💕",
                body: data.text || "Sent you a media message..."
            },
            data: {
                chatId: context.params.chatId,
                click_action: "FLUTTER_NOTIFICATION_CLICK"
            }
        };

        try {
            await admin.messaging().send(payload);
            console.log(`PUSH: Successfully sent notification to ${receiverId}`);
        } catch (error) {
            console.error("PUSH: Error sending notification:", error);
        }
        
        return null;
    });
