import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthView.css';

const AuthView = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(email, password);
            } else {
                result = await signup(name, email, password, isOwner ? 'owner' : 'tenant');
            }

            if (result.success) {
                navigate('/feed');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Algo deu errado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <h1 className="logo-text">
                        <span className="logo-in">In</span>
                        <span className="logo-house">House</span>
                    </h1>
                    <p className="logo-tagline">Plataforma Social Imobiliária</p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2 className="auth-title">
                        {isLogin ? 'Bem-vindo de Volta' : 'Criar Conta'}
                    </h2>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Nome Completo</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Justino Admin"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@inhouse.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isOwner}
                                    onChange={(e) => setIsOwner(e.target.checked)}
                                />
                                <span>Quero anunciar imóveis (Criar conta de Proprietário)</span>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>

                    <div className="auth-toggle">
                        <p>
                            {isLogin ? "Não tem uma conta?" : 'Já tem uma conta?'}
                            {' '}
                            <button
                                type="button"
                                className="toggle-button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                }}
                            >
                                {isLogin ? 'Cadastre-se' : 'Entrar'}
                            </button>
                        </p>
                    </div>
                </form>

                {/* Demo Credentials */}
                <div className="auth-demo">
                    <p>👉 Demo: admin@inhouse.com / admin</p>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
