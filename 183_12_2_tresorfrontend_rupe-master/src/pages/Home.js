import '../App.css';

/**
 * Home
 * @author Peter Rutschmann
 */
const Home = () => {
    return (
        <main className="home-container">
            <h1>Speichern Sie Ihre Daten sicher ab</h1>
            <section className="home-info">
                <p>In dieser Applikation können Sie, nachdem Sie sich registriert haben, Ihre sensitiven Daten verschlüsselt in einer Datenbank speichern.</p>
                <p>Erstellen Sie ein neues Secret und wählen Sie zwischen <strong>Credentials</strong>, <strong>Credit-Cards</strong> und <strong>Notes</strong>.</p>
            </section>
        </main>
    );
};

export default Home;
