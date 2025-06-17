import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSecret } from "../../comunication/FetchSecrets";
import "../../App.css";

/**
 * NewNote
 * @author Peter Rutschmann
 */
function NewNote({loginValues}) {
    const initialState = {
        kindid: 3,
        kind:"note",
        title: "",
        content: "",
    };
    const [noteValues, setNoteValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = noteValues;
            await postSecret({loginValues, content});
            setNoteValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="note-container">
            <h2>Add new note secret</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={noteValues.title}
                        onChange={(e) => setNoteValues(prev => ({ ...prev, title: e.target.value }))}
                        required
                        placeholder="Please enter a title *"
                    />
                </div>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        rows={4}
                        value={noteValues.content}
                        onChange={(e) => setNoteValues(prev => ({ ...prev, content: e.target.value }))}
                        required
                        placeholder="Please enter a content *"
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="btn-submit">Save secret</button>
            </form>
        </div>
    );
}

export default NewNote;
