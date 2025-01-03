// src/components/Chat.js
import React, { useState, useEffect } from "react";
import { database, fetchPublicKey, saveMessage } from "../firebase";
import { ref, onValue } from "firebase/database";
import { decryptMessage, encryptMessage } from "../cryptoUtils";

const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const privateKey = localStorage.getItem("privateKey");

        const messagesRef = ref(database, "messages/");
        onValue(messagesRef, async (snapshot) => {
            const data = snapshot.val();
            const decryptedMessages = [];

            // for (const id in data) {
            //     decryptedMessages.push({ id, ...data[id] });
            // }
            for (const id in data) {
                const msg = data[id];
                if (msg.recipient === userId) {
                    const decryptedMessage = await decryptMessage(privateKey, msg.encryptedMessage);
                    decryptedMessages.push({
                        ...msg,
                        decryptedMessage,
                    });
                }
            }

            setMessages(decryptedMessages);
        });

    }, [userId]);


    const handleSendMessage = async () => {
        if (message.trim() === "") return;
        try {
            // const recipientPublicKey = await fetchPublicKey(recipientId);
            // const encryptedMessage = await encryptMessage(recipientPublicKey, message);

            // await saveMessage(senderId, recipientId, encryptedMessage);
            // // const messagesRef = ref(database, "messages/");
            // // await push(messagesRef, {
            // //     text: message,
            // //     sender: auth.currentUser.email,
            // //     timestamp: Date.now(),
            // // });
            setMessage(""); // Clear the input after sending
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}</strong>: {msg.decryptedMessage}
                    </div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};




export default Chat;
