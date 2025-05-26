import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserRegister } from "../../comunication/FetchUser";
import ReCAPTCHA from 'react-google-recaptcha';

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
            return;
        }

        try {
            await postUserRegister({ ...credentials, recaptchaToken: captchaToken.toString() });
            setLoginValues({ userName: credentials.email, password: credentials.password, recaptchaToken: captchaToken });
            setCredentials(initialState);
            setCaptchaToken(''); // Captcha Token zurücksetzen
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setCredentials(prev => ({ ...prev, errorMessage: error.message }));
            setCaptchaToken(''); // Captcha Token zurücksetzen
        }
    };

    return (
        <div>
            <h2>Register user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                <aside>
                    <div>
                        <label>Firstname:</label>
                        <input
                            type="text"
                            value={credentials.firstName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, firstName: e.target.value}))}
                            required
                            placeholder="Please enter your firstname *"
                        />
                    </div>
                    <div>
                        <label>Lastname:</label>
                        <input
                            type="text"
                            value={credentials.lastName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, lastName: e.target.value}))}
                            required
                            placeholder="Please enter your lastname *"
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, email: e.target.value}))}
                            required
                            placeholder="Please enter your email"
                        />
                    </div>
                </aside>
                    <aside>
                        <div>
                            <label>Password:</label>
                            <div style={{ display: 'flex', alignItems: 'column' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                    placeholder="Please enter your pwd *"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    style={{ border: 'black', padding: '0 4px', cursor: 'pointer', marginBottom: '1rem', marginTop: '0rem', marginLeft: '1rem' }}
                                >
                                    show
                                </button>
                            </div>
                        </div>
                        <div>
                            <label>Confirm Password:</label>
                            <div style={{ display: 'flex', alignItems: 'column' }}>
                                <input
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    value={credentials.passwordConfirmation}
                                    onChange={(e) => setCredentials(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                                    required
                                    placeholder="Please confirm your pwd *"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(prev => !prev)}
                                    style={{ border: 'black', padding: '0 4px', cursor: 'pointer', marginBottom: '1rem', marginTop: '0rem', marginLeft: '1rem' }}
                                >
                                    show
                                </button>
                            </div>
                        </div>
                    </aside>
                </section>

                <ReCAPTCHA
                    sitekey="6Ldm8hUrAAAAAGnVPx33xjO6LkfdDu2nBzQBFZ9s"
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken('')}
                    ref={captchaRef} // Captcha refference to reset
                />

                <button type="submit">Register</button>
                {credentials.errorMessage && <p style={{ color: 'red' }}>{credentials.errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;
