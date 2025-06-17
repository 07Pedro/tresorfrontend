import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSecret } from '../../comunication/FetchSecrets';
import "../../App.css"

/**
 * NewCredential
 * @author Peter Rutschmann
 */
function NewCredential({loginValues}) {
    const initialState = {
        kindid: 1,
        kind:"credential",
        userName: "",
        password: "",
        url: ""
    };
    const [credentialValues, setCredentialValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = credentialValues;
            await postSecret({loginValues, content});
            setCredentialValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="credential-container">
            <h2 className="credential-title">Add new credential secret</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={credentialValues.userName}
                        onChange={(e) =>
                            setCredentialValues((prev) => ({ ...prev, userName: e.target.value }))
                        }
                        required
                        placeholder="Enter username"
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={credentialValues.password}
                        onChange={(e) =>
                            setCredentialValues((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                        placeholder="Enter password"
                    />
                </div>

                <div className="form-group">
                    <label>URL:</label>
                    <input
                        type="text"
                        value={credentialValues.url}
                        onChange={(e) =>
                            setCredentialValues((prev) => ({ ...prev, url: e.target.value }))
                        }
                        required
                        placeholder="Enter URL"
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="button-container">
                    <button type="submit" className="btn-submit">Save secret</button>
                </div>
            </form>
        </div>
    );
}

export default NewCredential;
