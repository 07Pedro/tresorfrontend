import '../../App.css';
import React, {useEffect, useState} from 'react';
import {getSecretsforUser} from "../../comunication/FetchSecrets";

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

                const data = await response.json(); // warten auf antwort vom backend(secrets)

                if (data.length === 0) {
                    console.log("No secrets found.");
                    setSecrets([]);
                    return;
                }

                setSecrets(data); // secrets vom backend dem Frontend const. zuweisen
            } catch (error) {
                console.error("Error fetching secrets:", error);
                setSecrets([]);
            }
        };
        fetchSecrets();
    }, [loginValues]);

    return (
        <>
            <h1>my secrets</h1>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
             <form>
                <h2>secrets</h2>
                <table border="1">
                    <thead>
                    <tr>
                        <th>secret id</th>
                        <th>user id</th>
                        <th>content</th>
                    </tr>
                    </thead>
                    <tbody>
                    {secrets?.length > 0 ? (
                        secrets.map(secret => (
                            <tr key={secret.id}>
                                <td>{secret.id}</td>
                                <td>{secret.userId}</td>
                                <td>
                                    <pre>{JSON.stringify(secret.content, null, 2)}</pre>
                                </td>
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