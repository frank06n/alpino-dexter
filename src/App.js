// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        setUser(true);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={user ? <Chat /> : <Login onLogin={handleLogin} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
