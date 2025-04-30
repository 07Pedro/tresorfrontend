import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserRegister } from "../../comunication/FetchUser";
import ReCAPTCHA from 'react-google-recaptcha';

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errorMessage: ""
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        //validate
        if(credentials.password !== credentials.passwordConfirmation) {
            console.log("password != passwordConfirmation");
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        console.log(typeof captchaToken)

        if (!captchaToken) {
            setErrorMessage('Please complete the CAPTCHA.');
            return;
        }

        try {
            await postUserRegister({ ...credentials, recaptchaToken: captchaToken.toString() });
            setLoginValues({ userName: credentials.email, password: credentials.password, recaptchaToken: captchaToken });
            setCredentials(initialState);
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
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
                />

                <button type="submit">Register</button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;
