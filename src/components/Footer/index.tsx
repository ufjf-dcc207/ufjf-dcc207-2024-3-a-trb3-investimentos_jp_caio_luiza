import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <img src="/InvestSimLogoSFundo.png" alt="Logo" className="footer-logo" />
            <div className="footer-content">
                <div className="authorship">
                    <p>Desenvolvido por Caio Reis, João Pedro Nascimento e Luiza Caldeira</p>
                </div>
                <div className="creation-date">
                    <p>Fevereiro de 2025</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;