import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";
import "../../App.css";

/**
 * NewCreditCard
 * @author Peter Rutschmann
 */
function NewCreditCard({loginValues}) {
    const initialState = {
        kindid: 2,
        kind:"creditcard",
        cardtype: "",
        cardnumber: "",
        expiration: "",
        cvv: ""
    };
    const [creditCardValues, setCreditCardValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = creditCardValues;
            await postSecret({ loginValues, content });
            setCreditCardValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="creditcard-container">
            <h2 className="creditcard-title">Add new credit-card secret</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Card Type:</label>
                    <select
                        value={creditCardValues.cardtype}
                        onChange={(e) =>
                            setCreditCardValues(prev => ({ ...prev, cardtype: e.target.value }))
                        }
                        required
                    >
                        <option value="" disabled>Please select card type</option>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Card Number:</label>
                    <input
                        type="text"
                        value={creditCardValues.cardnumber}
                        onChange={(e) =>
                            setCreditCardValues(prev => ({ ...prev, cardnumber: e.target.value }))
                        }
                        required
                        placeholder="Enter card number"
                    />
                </div>

                <div className="form-group">
                    <label>Expiration (MM/YY):</label>
                    <input
                        type="text"
                        value={creditCardValues.expiration}
                        onChange={(e) =>
                            setCreditCardValues(prev => ({ ...prev, expiration: e.target.value }))
                        }
                        required
                        placeholder="Enter expiration"
                    />
                </div>

                <div className="form-group">
                    <label>CVV:</label>
                    <input
                        type="text"
                        value={creditCardValues.cvv}
                        onChange={(e) =>
                            setCreditCardValues(prev => ({ ...prev, cvv: e.target.value }))
                        }
                        required
                        placeholder="Enter CVV"
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

export default NewCreditCard;
