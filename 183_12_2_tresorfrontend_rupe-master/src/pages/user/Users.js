import '../../App.css';
import React, { useEffect, useState } from "react";
import { getUsers } from "../../comunication/FetchUser";

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = ({ loginValues }) => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                setUsers(users);
                setErrorMessage('');
            } catch (error) {
                console.error('Failed to fetch to server:', error.message);
                setErrorMessage(error.message);
            }
        };
        fetchUsers();
    }, [loginValues]);

    return (
        <main className="users-container">
            <h1>Client list</h1>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <ul className="users-list">
                {users.map(user => (
                    <li key={user.id}>
                        <strong>{user.id}:</strong> {user.firstName} {user.lastName} - {user.email} - <em>{user.password}</em>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default Users;