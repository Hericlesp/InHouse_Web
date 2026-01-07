import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhotoUploader from '../components/PhotoUploader';
import './AddPropertyView.css';

const AddPropertyView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        price: '',
        type: 'Apartment',
        condo_fee: '',
        iptu: '',
        accepts_pets: false,
        is_furnished: false,
        guarantee_type: 'Fiador',
        availability_date: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    owner_email: user.email,
                    country: 'Brasil',
                    status: 'Available'
                })
            });

            if (!response.ok) throw new Error('Failed to create property');

            navigate('/owner/properties');
        } catch (error) {
            console.error('Error creating property:', error);
            alert('Erro ao criar imóvel. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-property-view">
            <div className="form-header">
                <h1>Adicionar Novo Imóvel</h1>
                <p>Preencha as informações do seu imóvel</p>
            </div>

            <form className="property-form" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="form-section">
                    <h3>Informações Básicas</h3>

                    <div className="form-group">
                        <label>Título do Anúncio *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Apartamento moderno em Copacabana"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tipo *</label>
                            <select name="type" value={formData.type} onChange={handleChange} required>
                                <option value="Apartment">Apartamento</option>
                                <option value="House">Casa</option>
                                <option value="Studio">Studio</option>
                                <option value="Kitnet">Kitnet</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Valor do Aluguel (R$) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="3000"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="form-section">
                    <h3>Localização</h3>

                    <div className="form-group">
                        <label>Endereço Completo *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Av. Atlântica, 1500"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Bairro *</label>
                            <input
                                type="text"
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                placeholder="Copacabana"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Cidade *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Rio de Janeiro"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Estado *</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="RJ"
                                maxLength="2"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Costs */}
                <div className="form-section">
                    <h3>Custos Adicionais</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Condomínio (R$)</label>
                            <input
                                type="number"
                                name="condo_fee"
                                value={formData.condo_fee}
                                onChange={handleChange}
                                placeholder="500"
                            />
                        </div>

                        <div className="form-group">
                            <label>IPTU (R$)</label>
                            <input
                                type="number"
                                name="iptu"
                                value={formData.iptu}
                                onChange={handleChange}
                                placeholder="150"
                            />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="form-section">
                    <h3>Características</h3>

                    <div className="form-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="accepts_pets"
                                checked={formData.accepts_pets}
                                onChange={handleChange}
                            />
                            <span>Aceita Pets</span>
                        </label>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_furnished"
                                checked={formData.is_furnished}
                                onChange={handleChange}
                            />
                            <span>Mobiliado</span>
                        </label>
                    </div>
                </div>

                {/* Contract Info */}
                <div className="form-section">
                    <h3>Informações Contratuais</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tipo de Garantia *</label>
                            <select name="guarantee_type" value={formData.guarantee_type} onChange={handleChange} required>
                                <option value="Fiador">Fiador</option>
                                <option value="Depósito Caução">Depósito Caução</option>
                                <option value="Fiador ou Caução">Fiador ou Caução</option>
                                <option value="Seguro Fiança">Seguro Fiança</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Data de Disponibilidade</label>
                            <input
                                type="date"
                                name="availability_date"
                                value={formData.availability_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="form-section">
                    <h3>Descrição</h3>

                    <div className="form-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descreva seu imóvel, destaque os diferenciais..."
                            rows="5"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/owner/properties')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Salvando...' : 'Publicar Imóvel'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPropertyView;
