// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, push, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDEcSdyHv72mvybv4w3QyGDxQEh1L94Lc4",
    // authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "test-tech-triad",
    // storageBucket: "YOUR_STORAGE_BUCKET",
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    // appId: "YOUR_APP_ID",
    databaseURL: "https://test-tech-triad-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// Save the public key
export async function savePublicKey(userId, publicKey) {
    console.log(userId);
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, { publicKey });
}


export async function getUserId(email) {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
        // Check if the email exists in any user
        const users = snapshot.val();
        for (const userId in users) {
            if (users[userId].email === email) {
                console.log("User with this email already exists.");
                // Return the existing userId if the email is found
                return userId;
            }
        }
    }

    // Create a new user if email doesn't exist
    const newUserRef = push(usersRef);// Generate a random userId using Firebase's push method
    const newUserId = newUserRef.key; // Randomly generated unique ID

    await set(newUserRef, {
        //...userData, // userData contains all user details
        email: email, // ensure email is included in the new user object
        createdAt: new Date().toISOString(),
    });
    console.log(`New user created with ID: ${newUserId}`);
    return newUserId; // Return the new userId
}



// Fetch a public key
export async function fetchPublicKey(userId) {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        return snapshot.val().publicKey;
    }
    throw new Error("Public key not found");
}

export async function saveMessage(senderId, recipientId, encryptedMessage) {
    const messageRef = ref(database, `messages/`);
    await push(messageRef, {
        sender: senderId,
        recipient: recipientId,
        encryptedMessage,
        timestamp: Date.now(),
    });
}