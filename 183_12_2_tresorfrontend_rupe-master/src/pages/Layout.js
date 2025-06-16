import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "../css/mvp.css";

const Layout = ({ loginValues }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setActiveDropdown((prev) => (prev === menu ? null : menu));
    };

    return (
        <div style={{ fontFamily: "sans-serif", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <nav className="navbar">
                <div className="nav-header">
                    <h1>🔐 Secret Tresor</h1>
                    <p>{loginValues.email === '' ? 'No user logged in' : `User: ${loginValues.email}`}</p>
                </div>
                <ul className="nav-list">
                    <li className="nav-item dropdown">
                        <span>Secrets ▾</span>
                        <ul className="dropdown-menu">
                            <li><Link to="/secret/secrets">My Secrets</Link></li>
                            <li><Link to="/secret/newcredential">New Credential</Link></li>
                            <li><Link to="/secret/newcreditcard">New Credit Card</Link></li>
                            <li><Link to="/secret/newnote">New Note</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <span>User ▾</span>
                        <ul className="dropdown-menu">
                            <li><Link to="/user/login">Login</Link></li>
                            <li><Link to="/user/register">Register</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <span>Admin ▾</span>
                        <ul className="dropdown-menu">
                            <li><Link to="/user/users">All Users</Link></li>
                            <li>Add User</li>
                            <li><Link to="/user/users/:id">Edit User</Link></li>
                            <li>All Secrets</li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link to="/">About</Link>
                    </li>
                </ul>
            </nav>
            <main style={{ padding: "2rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
