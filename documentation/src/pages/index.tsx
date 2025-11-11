import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Accueil"
      description="Documentation technique de l'application Tamagotcho">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1 className="hero__title">
              Tamagotcho Documentation
            </h1>
            <p className="hero__subtitle">
              Documentation technique complète du projet Tamagotchi Next.js
            </p>
            <div className="margin-vert--lg">
              <Link
                className="button button--primary button--lg"
                to="/documentation/docs/intro">
                📚 Consulter la documentation →
              </Link>
            </div>

            <div className="row margin-top--lg">
              <div className="col col--4">
                <div className="card">
                  <div className="card__header">
                    <h3>🏗️ Architecture</h3>
                  </div>
                  <div className="card__body">
                    <p>
                      Clean Architecture, SOLID, Domain-Driven Design
                    </p>
                    <Link to="/documentation/docs/architecture/overview">
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col col--4">
                <div className="card">
                  <div className="card__header">
                    <h3>⚙️ Fonctionnalités</h3>
                  </div>
                  <div className="card__body">
                    <p>
                      Gestion des monstres, authentification, dashboard
                    </p>
                    <Link to="/documentation/docs/features/monsters">
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col col--4">
                <div className="card">
                  <div className="card__header">
                    <h3>🔌 API</h3>
                  </div>
                  <div className="card__body">
                    <p>
                      Routes API, Server Actions, Use Cases
                    </p>
                    <Link to="/documentation/docs/api/endpoints">
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="margin-top--xl">
              <h2>🚀 Quick Start</h2>
              <p>
                <strong>Stack technique:</strong> Next.js 15.5.4, React 19, TypeScript, Tailwind CSS 4, MongoDB, Better Auth
              </p>
              <div className="language-bash">
                <pre><code>{`# Installation
npm install

# Développement
npm run dev

# Build production
npm run build`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
