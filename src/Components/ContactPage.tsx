
import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    return (
        <div className="contact-container">
            <div className="contact-title">Contato</div>
            <div className="contact-text">
                Bem-vindo à nossa página de contato! Se você tiver dúvidas, sugestões ou precisar de ajuda, entre em contato conosco. Estamos prontos para ajudar e garantir a melhor experiência possível para você.
            </div>
            <div className="contact-text">
                Email: <a href="mailto:plannerbarbeiro@email.com" style={{color:'#ffd700'}}>plannerbarbeiro@email.com</a><br/>
                WhatsApp: <a href="https://wa.me/5599999999999" target="_blank" rel="noopener noreferrer" style={{color:'#ffd700'}}>+55 99 99999-9999</a>
            </div>
        </div>
    );
};

export default ContactPage;