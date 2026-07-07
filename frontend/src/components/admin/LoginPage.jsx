import { useState } from 'react';
import PropTypes from 'prop-types';
import { loginAdmin } from '../../services/api.js';

export function LoginPage({ onLoginSuccess, onNavigateHome }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message ?? 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-card__header">
          <button type="button" className="login-card__back" onClick={onNavigateHome} id="btn-back-from-login">
            ← Voltar
          </button>
          <img className="login-card__logo" src="/logo.png?v=2" alt="Memorial Farewell" />
          <h2 className="login-card__title">Área Restrita</h2>
          <p className="login-card__subtitle">Informe a senha administrativa para continuar</p>
        </header>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-field__label" htmlFor="admin-password">
              Senha de Acesso
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha..."
              required
              autoFocus
            />
          </div>

          {error && (
            <output className="admin-toast admin-toast--error" style={{ marginTop: '12px', display: 'block' }}>
              {error}
            </output>
          )}

          <button
            type="submit"
            className="btn btn--primary login-card__submit"
            disabled={loading || !password}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  onNavigateHome: PropTypes.func.isRequired,
};
