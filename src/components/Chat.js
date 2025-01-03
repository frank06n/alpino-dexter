// src/components/Chat.js
import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, push, onValue } from "firebase/database";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const messagesRef = ref(database, "messages/");
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = [];
            for (const id in data) {
                loadedMessages.push({ id, ...data[id] });
            }
            setMessages(loadedMessages);
        });
    }, []);

    const sendMessage = async () => {
        if (message.trim() === "") return;
        const messagesRef = ref(database, "messages/");
        await push(messagesRef, {
            text: message,
            sender: auth.currentUser.email,
            timestamp: Date.now(),
        });
        setMessage("");
    };

    return (
        <div>
            <div>
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <strong>{msg.sender}</strong>: {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
