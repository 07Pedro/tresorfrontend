import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import eyeOpen from "../../img/view.png";
import eyeClosed from "../../img/hide.png";

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginValues)
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem("token", token);
                navigate('/');
            } else {
                const errorText = await response.text();
                alert("Login fehlgeschlagen: " + errorText);
            }
        } catch (error) {
            console.error("Fehler beim Login:", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Benutzer Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={loginValues.email}
                        onChange={e => setLoginValues(prev => ({ ...prev, email: e.target.value }))}
                        required
                        placeholder="Email eingeben *"
                    />
                </div>

                <div className="form-group">
                    <label>Passwort:</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={loginValues.password}
                            onChange={e => setLoginValues(prev => ({ ...prev, password: e.target.value }))}
                            required
                            placeholder="Passwort eingeben *"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-label="Passwort anzeigen/verstecken"
                        >
                            <img
                                src={showPassword ? eyeOpen : eyeClosed}
                                alt={showPassword ? "Passwort sichtbar" : "Passwort versteckt"}
                                className="eye-icon"
                            />
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-submit">Login</button>
            </form>
        </div>
    );
}

export default LoginUser;