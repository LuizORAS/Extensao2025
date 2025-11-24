import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
    return (
        <div className="about-page-container">
            <div className="aboutpage-bg" />
            <div className="aboutpage-overlay" />
            <div className="about-page-content">
                <h1>Sobre este projeto</h1>

                <section className="about-section">
                    <h2>Ideia</h2>
                    <p>
                        A ideia do PlannerBarbeiro nasceu para ajudar meu primo Samuel Chagas, um barbeiro iniciante de 17 anos que, após concluir o curso, tinha dificuldade
                        para organizar sua agenda e as finanças. Ao notar essa necessidade, decidi criar uma aplicação web responsiva — compatível com celular — para auxiliá‑lo
                        a gerenciar melhor o seu novo ofício.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Sobre o site</h2>
                    <p>
                        O site usa React no front-end e Express.js no back-end, com SQLite como banco de dados. Durante o desenvolvimento foram utilizadas ferramentas como
                        Postman (para testar a API), VS Code como IDE e a metodologia Kanban para organizar o trabalho e seguir boas práticas de programação.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Disclaimer</h2>
                    <p>
                        Este projeto foi idealizado sem fins lucrativos, com a supervisão do Professor Ricardo, do Instituto Infnet, para garantir a melhor execução possível.
                        O programador idealizador e desenvolvedor foi Luiz Felipe de Lima Barbosa, aluno da instituição. O código-fonte deste projeto está disponível publicamente
                        no repositório do GitHub e pode ser utilizado para fins educacionais e não comerciais.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;