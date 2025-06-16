
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserRegister } from "../../comunication/FetchUser";
import ReCAPTCHA from 'react-google-recaptcha';
import viewIcon from "../../img/view.png";
import hideIcon from "../../img/hide.png";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const captchaRef = useRef(null); // captcha refference to reset

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errorMessage: ""
    };
    const [credentials, setCredentials] = useState(initialState);
    const [captchaToken, setCaptchaToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    // Error messages depending on pwd strenght
    function validatePassword(password) {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return "";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setCredentials(prev => ({ ...prev, errorMessage: '' }));

        // Captcha prüfen
        if (!captchaToken) {
            setCredentials(prev => ({ ...prev, errorMessage: 'Please complete the CAPTCHA.' }));
            return;
        }

        // Passwort validieren
        const passwordError = validatePassword(credentials.password);
        if (passwordError) {
            setCredentials(prev => ({ ...prev, errorMessage: passwordError }));
            setCaptchaToken(''); // Captcha Token zurücksetzen
            if (captchaRef.current) {
                captchaRef.current.reset(); // Captcha state zurücksetzen
            }
            return;
        }

        // Passwörter vergleichen
        if (credentials.password !== credentials.passwordConfirmation) {
            setCredentials(prev => ({ ...prev, errorMessage: 'Password and password-confirmation are not equal.' }));
            setCaptchaToken(''); // Captcha Tokem zurücksetzen
            if (captchaRef.current) {
                captchaRef.current.reset(); // Captcha state zurücksetzen
            }
            return;
        }

        try {
            await postUserRegister({ ...credentials, recaptchaToken: captchaToken.toString() });
            setLoginValues({ userName: credentials.email, password: credentials.password, recaptchaToken: captchaToken });
            setCredentials(initialState);
            setCaptchaToken(''); // Captcha Token zurücksetzen
            if (captchaRef.current) {
                captchaRef.current.reset(); // Captcha state zurücksetzen
            }
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setCredentials(prev => ({ ...prev, errorMessage: error.message }));
            setCaptchaToken(''); // Captcha Token zurücksetzen
            if (captchaRef.current) {
                captchaRef.current.reset(); // Captcha state zurücksetzen
            }
        }
    };

    return (
        <div className="register-container">
            <h2>Benutzer registrieren</h2>
            <form onSubmit={handleSubmit}>
                <section className="register-section">
                    <aside>
                        <label>
                            Firstname:
                            <input
                                type="text"
                                value={credentials.firstName}
                                onChange={e => setCredentials(prev => ({ ...prev, firstName: e.target.value }))}
                                required
                                placeholder="Please enter your firstname *"
                            />
                        </label>
                        <label>
                            Lastname:
                            <input
                                type="text"
                                value={credentials.lastName}
                                onChange={e => setCredentials(prev => ({ ...prev, lastName: e.target.value }))}
                                required
                                placeholder="Please enter your lastname *"
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={e => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                required
                                placeholder="Please enter your email"
                            />
                        </label>
                    </aside>

                    <aside>
                        <label>
                            Password:
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                    placeholder="Please enter your pwd *"
                                />
                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    aria-label="Passwort anzeigen oder verbergen"
                                >
                                    <img src={showPassword ? viewIcon : hideIcon} alt="toggle visibility" className="eye-icon" />
                                </button>
                            </div>
                        </label>

                        <label>
                            Confirm Password:
                            <div className="password-input-wrapper">
                                <input
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    value={credentials.passwordConfirmation}
                                    onChange={e => setCredentials(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                                    required
                                    placeholder="Please confirm your pwd *"
                                />
                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() => setShowPasswordConfirmation(prev => !prev)}
                                    aria-label="Passwort bestätigen anzeigen oder verbergen"
                                >
                                    <img src={showPasswordConfirmation ? viewIcon : hideIcon} alt="toggle visibility" className="eye-icon" />
                                </button>
                            </div>
                        </label>
                    </aside>
                </section>

                <ReCAPTCHA
                    sitekey="6Ldm8hUrAAAAAGnVPx33xjO6LkfdDu2nBzQBFZ9s"
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken('')}
                    ref={captchaRef} // Captcha refference to reset
                />

                <button type="submit" className="btn-submit">Register</button>

                {credentials.errorMessage && <p style={{ color: 'red' }}>{credentials.errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;