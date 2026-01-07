import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './SettingsView.css';

const SettingsView = () => {
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        notifications: true,
        emailUpdates: true,
        marketingEmails: false,
        darkMode: theme === 'dark'
    });

    const handleToggle = (key) => {
        if (key === 'darkMode') {
            toggleTheme();
        }
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="settings-view">
            <div className="settings-header">
                <h1>Configurações</h1>
                <p className="settings-subtitle">Gerencie suas preferências de conta</p>
            </div>

            {/* Appearance */}
            <div className="settings-section">
                <h3>Aparência</h3>
                <div className="setting-item">
                    <div>
                        <p className="setting-label">Modo Escuro</p>
                        <p className="setting-description">Usar tema escuro</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.darkMode}
                            onChange={() => handleToggle('darkMode')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            {/* Notifications */}
            <div className="settings-section">
                <h3>Notificações</h3>
                <div className="setting-item">
                    <div>
                        <p className="setting-label">Notificações Push</p>
                        <p className="setting-description">Receber notificações sobre sua atividade</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={() => handleToggle('notifications')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div>
                        <p className="setting-label">Atualizações por Email</p>
                        <p className="setting-description">Receber atualizações importantes por email</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.emailUpdates}
                            onChange={() => handleToggle('emailUpdates')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div>
                        <p className="setting-label">Emails de Marketing</p>
                        <p className="setting-description">Receber conteúdo promocional</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.marketingEmails}
                            onChange={() => handleToggle('marketingEmails')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            {/* Account */}
            <div className="settings-section">
                <h3>Conta</h3>
                <button className="settings-button">
                    Alterar Senha
                </button>
                <button className="settings-button danger">
                    Excluir Conta
                </button>
            </div>

            {/* About */}
            <div className="settings-section">
                <h3>Sobre</h3>
                <div className="about-info">
                    <p><strong>Versão:</strong> 1.0.0</p>
                    <p><strong>Plataforma:</strong> InHouse Web</p>
                    <p className="copyright">© 2026 InHouse. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
