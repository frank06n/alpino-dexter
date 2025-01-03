// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";

import { getUserId, savePublicKey } from "./firebase";
import { generateKeyPair } from "./cryptoUtils";
//import SendMessage from "./SendMessage";

const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = async (email) => {
        const userId = await getUserId(email);
        setUser(userId);
        initializeKeys(userId);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={user != null ? <Chat userId={user} /> : <Login onLogin={handleLogin} />}
                />
            </Routes>
        </Router>
    );

    // <Route path="/" element={<Navigate to="/chat" />} />
    // <Route path="/chat" element={<Chat userId={userId} />} />
    // <Route path="/send" element={<SendMessage senderId={userId} />} />
};


async function initializeKeys(userId) {
    const { publicKey, privateKey } = await generateKeyPair();

    // Save the public key to Firebase
    await savePublicKey(userId, publicKey);

    // Save the private key locally
    localStorage.setItem("privateKey", privateKey);
}



export default App;
