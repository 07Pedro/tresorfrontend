import '../../App.css';
import React, { useEffect, useState } from 'react';

/**
 * Secrets
 * @author Peter Rutschmann
 */
const Secrets = ({loginValues}) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSecrets = async () => {
            setErrorMessage('');
            if( ! loginValues.email){
                console.error('Secrets: No valid email, please do login first:' + loginValues);
                setErrorMessage("No valid email, please do login first.");
                return;
            }
            try {
                const response = await fetch("http://localhost:8080/api/secrets/byemail", { // POST request auf richtigen endpoint machen
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ // values wo migegeben werden
                        email: loginValues.email, // email
                        encryptPassword: loginValues.password // passwort
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch secrets: " + response.statusText);
                }

                const data = await response.json();

                if (data.length === 0) {
                    console.log("No secrets found.");
                    setSecrets([]);
                    return;
                }

                setSecrets(data);
            } catch (error) {
                console.error("Error fetching secrets:", error);
                setSecrets([]);
            }
        };
        fetchSecrets();
    }, [loginValues]);

    const renderSecretContent = (content) => {
        try {
            const parsed = typeof content === "string" ? JSON.parse(content) : content;
            return (
                <table>
                    <tbody>
                    {Object.entries(parsed).map(([key, value]) => (
                        <tr key={key}>
                            <td><strong>{key}</strong></td>
                            <td>{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        } catch (e) {
            return <pre>{content}</pre>; // fallback if not JSON
        }
    };

    return (
        <>
            <h1>My Secrets</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form>
                <h2>Secrets</h2>
                <table border="1" cellPadding={5}>
                    <thead>
                    <tr>
                        <th>Secret ID</th>
                        <th>User ID</th>
                        <th>Content</th>
                    </tr>
                    </thead>
                    <tbody>
                    {secrets?.length > 0 ? (
                        secrets.map(secret => (
                            <tr key={secret.id}>
                                <td>{secret.id}</td>
                                <td>{secret.userId}</td>
                                <td>{renderSecretContent(secret.content)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No secrets available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </form>
        </>
    );
};

export default Secrets;