// src/components/Chat.js
import React, { useState, useEffect, useCallback } from "react";
import { database, fetchPublicKey, getUserId, saveMessage } from "../firebase";
import { ref, onValue } from "firebase/database";
import { decryptMessage, encryptMessage } from "../cryptoUtils";
import './Chat.css';

const testmessages = [
    {
        "sender": "sender2",
        "recipient": "recipient3",
        "message": "How are you?",
        "timestamp": 1735933636520
    },
    {
        "sender": "sender3",
        "recipient": "recipient5",
        "message": "This is important.",
        "timestamp": 1735933636520
    },
    {
        "sender": "sender1",
        "recipient": "recipient2",
        "message": "How are you?",
        "timestamp": 1735933636520
    },
    {
        "sender": "sender1",
        "recipient": "recipient2",
        "message": "Let's meet at 3 PM.",
        "timestamp": 1735933636520
    },
    {
        "sender": "sender1",
        "recipient": "recipient3",
        "message": "Can you help me with this?",
        "timestamp": 1735933636520
    },
    {
        "sender": "sender4",
        "recipient": "recipient1",
        "message": "Can you help me with this?",
        "timestamp": 1735933636520
    }
];

const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");

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

    const handleSendMessage = useCallback(() => {
        if (message.trim() === "") return;

        (async () => {
            const recipientId = getUserId(recipientEmail);
            const recipientPublicKey = await fetchPublicKey(recipientId);
            const encryptedMessage = await encryptMessage(recipientPublicKey, message);

            await saveMessage(userId, recipientId, encryptedMessage);

            setMessage(""); // Clear the input after sending
        })();
    }, [userId, recipientEmail]);

    return (
        <div className="chat-container">
            <div className="messages-container">
                {testmessages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong className="sender">{msg.sender}</strong> to <strong className="recipient">{msg.recipient}</strong>:
                        <span className="message-text">{msg.message}</span>
                        <div className="timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient email"
                    className="input-field"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="input-field"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
        </div>

    );
};


/* {messages.map((msg, index) => (
    <div key={index}>
        <strong>{msg.sender}</strong>: {msg.decryptedMessage}
    </div>
))} */


export default Chat;
