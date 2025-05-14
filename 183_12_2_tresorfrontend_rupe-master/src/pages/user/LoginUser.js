import { useNavigate } from 'react-router-dom';
import React, {useState} from "react";

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
        <div>
            <h2>Login user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={loginValues.email}
                                onChange={(e) =>
                                    setLoginValues(prevValues => ({...prevValues, email: e.target.value}))}
                                required
                                placeholder="Please enter your email *"
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <div style={{ display: 'flex', alignItems: 'column' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginValues.password}
                                    onChange={(e) =>
                                        setLoginValues(prevValues => ({...prevValues, password: e.target.value}))}
                                    required
                                    placeholder="Please enter your password *"
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
                    </aside>
                </section>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginUser;