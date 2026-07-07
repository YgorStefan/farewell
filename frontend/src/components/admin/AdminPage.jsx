import { useState } from 'react';
import PropTypes from 'prop-types';
import { PessoasTab } from './PessoasTab.jsx';
import { RegistrosTab } from './RegistrosTab.jsx';
import { VeloriosTab } from './VeloriosTab.jsx';

const TABS = [
  { key: 'pessoas', label: 'Pessoas', icon: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2h0M20 8v6M23 11h-6M12 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { key: 'registros', label: 'Registros de Óbito', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
  { key: 'velorios', label: 'Velórios', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM9 22V12h6v10' },
];

export function AdminPage({ onNavigateHome, onLogout }) {
  const [activeTab, setActiveTab] = useState('pessoas');

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__header-left">
          <button type="button" className="admin__back" onClick={onNavigateHome} id="btn-back-panel">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 12H5M12 19l-7-7 7-7"
              />
            </svg>
            Voltar ao Painel
          </button>
        </div>
        <h1 className="admin__title">
          <svg className="admin__title-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Administração
        </h1>
        <div className="admin__header-right">
          <button type="button" className="admin__logout" onClick={onLogout} id="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <nav className="admin__tabs" aria-label="Entidades do banco">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            className={`admin__tab${activeTab === tab.key ? ' admin__tab--active' : ''}`}
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            id={`tab-${tab.key}`}
          >
            <svg className="admin__tab-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={tab.icon}
              />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin__content" role="tabpanel">
        {activeTab === 'pessoas' && <PessoasTab />}
        {activeTab === 'registros' && <RegistrosTab />}
        {activeTab === 'velorios' && <VeloriosTab />}
      </div>
    </div>
  );
}

AdminPage.propTypes = {
  onNavigateHome: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
