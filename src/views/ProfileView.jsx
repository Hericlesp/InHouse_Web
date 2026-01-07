import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import './ProfileView.css';

const ProfileView = () => {
    const { user, login } = useAuth(); // We might need to refresh user data
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        cpf: '',
        rg: '',
        address: '',
        job_title: '',
        company_name: '',
        cnpj: '',
        income_proof: '',
        document_photo: '',
        selfie_with_document: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                ...user
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [field]: reader.result // Reading as Base64 for prototype
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // List of mandatory fields for general profile completion
    const checkMandatoryFields = () => {
        const required = ['name', 'phone', 'cpf', 'rg', 'zip_code', 'street', 'number', 'neighborhood', 'city', 'state', 'document_photo', 'selfie_with_document'];
        const missing = required.filter(field => !formData[field]);
        return missing;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validation for mandatory fields
        const missingFields = checkMandatoryFields();
        if (missingFields.length > 0 && activeTab !== 'professional') {
            // We allow saving partial data, but maybe warn? 
            // For now, let's just save but alert if they try to do major actions later
        }

        setLoading(true);
        try {
            const result = await authApi.updateProfile({
                email: user.email,
                ...formData
            });

            if (result.success) {
                // Here we would ideally update the auth context with new user data
                // For now, let's assume valid response updates context or reload
                alert('Perfil atualizado com sucesso!');
                // Force reload or update context logic here (omitted for brevity, assume simple flow)
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    const toggleOwnerStatus = async () => {
        if (!confirm('Deseja alterar seu tipo de conta?')) return;

        try {
            const newType = user.user_type === 'owner' ? 'tenant' : 'owner';
            await authApi.updateProfile({
                email: user.email,
                user_type: newType
            });
            window.location.reload(); // Simple reload to reflect changes
        } catch (error) {
            alert('Erro ao alterar tipo de conta');
        }
    };

    if (!user) return <div>Carregando...</div>;

    const renderFileUpload = (field, label) => (
        <div className="file-upload-item">
            <label>{label}</label>
            <div className="file-upload-box" onClick={() => document.getElementById(field).click()}>
                {formData[field] ? (
                    <div className="preview-container">
                        <img src={formData[field]} alt="Preview" className="preview-image" />
                        <button
                            className="btn-remove-photo"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({ ...prev, [field]: '' }));
                            }}
                        >
                            Remover
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <span>📷</span>
                        <p>Clique para adicionar foto</p>
                    </div>
                )}
                <input
                    id={field}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, field)}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );

    return (
        <div className="profile-view">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-badges">
                        <span className={user.user_type === 'owner' ? 'badge-owner' : 'badge-tenant'}>
                            {user.user_type === 'owner' ? 'Proprietário' : 'Inquilino'}
                        </span>
                        {user.verified && <span className="badge-verified">✓ Verificado</span>}
                    </div>
                </div>
            </div>

            {/* Scores & Owner Panel */}
            <div className="profile-scores">
                <div className="score-card">
                    <p className="score-label">Pontuação</p>
                    <div className="score-value">{user.points || 0}/100</div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min(user.points || 0, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="score-card">
                    <p className="score-label">Avaliação</p>
                    <div className="score-value">⭐ {user.stars?.toFixed(1) || '5.0'}</div>
                    <div className="stars-container">
                        {/* Static stars for now */}
                        ★★★★★
                    </div>
                </div>
            </div>

            {/* Owner Toggle Panel */}
            <div className="owner-panel-card">
                <div className="panel-content">
                    <h3>Painel do Proprietário</h3>
                    <p>
                        {user.user_type === 'owner'
                            ? 'Gerencie seus imóveis e visualize leads.'
                            : 'Quer anunciar imóveis? Torne-se um proprietário.'}
                    </p>
                </div>
                <button
                    className="btn-panel"
                    onClick={user.user_type === 'owner' ? () => navigate('/owner/dashboard') : toggleOwnerStatus}
                >
                    {user.user_type === 'owner' ? 'Acessar Painel' : 'Virar Proprietário'}
                </button>
            </div>

            {/* Main Form */}
            <div className="profile-section">
                <div className="section-header">
                    <h2>Informações</h2>
                </div>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Dados Pessoais
                    </button>
                    <button
                        className={`tab ${activeTab === 'docs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('docs')}
                    >
                        Documentos
                    </button>
                    <button
                        className={`tab ${activeTab === 'address' ? 'active' : ''}`}
                        onClick={() => setActiveTab('address')}
                    >
                        Endereço
                    </button>
                    <button
                        className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
                        onClick={() => setActiveTab('professional')}
                    >
                        Profissional
                    </button>
                </div>

                <form onSubmit={handleSave} className="form-grid">
                    {activeTab === 'personal' && (
                        <>
                            <div className="form-group">
                                <label>Nome Completo</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input value={user.email} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>Telefone</label>
                                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" />
                            </div>
                        </>
                    )}

                    {activeTab === 'docs' && (
                        <>
                            <div className="form-group">
                                <label>CPF</label>
                                <input name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00" />
                            </div>
                            <div className="form-group">
                                <label>RG / CNH</label>
                                <input name="rg" value={formData.rg} onChange={handleInputChange} />
                            </div>
                            {renderFileUpload('document_photo', 'Foto do Documento (Frente e Verso)')}
                            {renderFileUpload('selfie_with_document', 'Selfie segurando o documento')}
                        </>
                    )}

                    {activeTab === 'address' && (
                        <>
                            <div className="form-group-row">
                                <div className="form-group" style={{ flex: '1' }}>
                                    <label>CEP *</label>
                                    <input name="zip_code" value={formData.zip_code || ''} onChange={handleInputChange} placeholder="00000-000" />
                                </div>
                                <div className="form-group" style={{ flex: '2' }}>
                                    <label>Cidade *</label>
                                    <input name="city" value={formData.city || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ flex: '0.5' }}>
                                    <label>UF *</label>
                                    <input name="state" value={formData.state || ''} onChange={handleInputChange} maxLength="2" />
                                </div>
                            </div>

                            <div className="form-group-row">
                                <div className="form-group" style={{ flex: '3' }}>
                                    <label>Rua / Logradouro *</label>
                                    <input name="street" value={formData.street || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ flex: '1' }}>
                                    <label>Número *</label>
                                    <input name="number" value={formData.number || ''} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Bairro *</label>
                                <input name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label>Ponto de Referência (Opcional)</label>
                                <input
                                    name="complement"
                                    value={formData.complement || ''}
                                    onChange={handleInputChange}
                                    placeholder="Próximo ao mercado..."
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'professional' && (
                        <>
                            <div className="info-banner">
                                <span className="info-icon">ℹ️</span>
                                <p>Estas informações são opcionais, mas tornam-se <strong>obrigatórias</strong> para entrar em contato com proprietários.</p>
                            </div>
                            <div className="form-group">
                                <label>Cargo / Profissão</label>
                                <input name="job_title" value={formData.job_title || ''} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Empresa</label>
                                <input name="company_name" value={formData.company_name || ''} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>CNPJ (Opcional)</label>
                                <input name="cnpj" value={formData.cnpj || ''} onChange={handleInputChange} />
                            </div>
                            {renderFileUpload('income_proof', 'Comprovante de Renda')}
                        </>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent Activity */}
            <div className="profile-section">
                <h2>Atividades Recentes</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">❤️</div>
                        <div className="activity-content">
                            <p className="activity-title">Você favoritou "Apartamento no Leblon"</p>
                            <p className="activity-time">Hoje</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">⭐</div>
                        <div className="activity-content">
                            <p className="activity-title">Ganhou +10 pontos por completar o perfil</p>
                            <p className="activity-time">Há 1 dia</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">👋</div>
                        <div className="activity-content">
                            <p className="activity-title">Você indicou um amigo</p>
                            <p className="activity-time">Há 3 dias</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
