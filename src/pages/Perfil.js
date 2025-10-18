import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiSave } from 'react-icons/fi';
import './Perfil.css';

const Perfil = () => {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    phone: profile?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updateProfile(formData);

      if (error) {
        setMessage({
          type: 'error',
          text: 'Erro ao atualizar perfil. Tente novamente.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Perfil atualizado com sucesso!',
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar perfil. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-container">
      {/* Header */}
      <div className="perfil-header">
        <h1>Perfil</h1>
        <p>Gerencie suas informações pessoais</p>
      </div>

      <div className="perfil-grid">
        {/* Profile Card */}
        <div className="perfil-card">
          <div className="perfil-avatar">
            <span>
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="perfil-name">{profile?.full_name || 'Usuário'}</h2>
          <p className="perfil-email">{profile?.email}</p>
          {profile?.company_name && (
            <div className="perfil-company-badge">
              {profile.company_name}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="perfil-main-content">
          <div className="perfil-form-card">
            <h2 className="perfil-form-title">Informações Pessoais</h2>

            {message.text && (
              <div
                className={`alert ${
                  message.type === 'success' ? 'alert-success' : 'alert-error'
                }`}
                style={{ marginBottom: '1rem' }}
              >
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="perfil-form">
              <div className="perfil-form-group">
                <label className="perfil-label">Email</label>
                <div className="perfil-input-wrapper">
                  <FiMail className="perfil-input-icon" />
                  <input
                    type="email"
                    className="perfil-input"
                    value={profile?.email || ''}
                    disabled
                  />
                </div>
                <span className="perfil-label-hint">
                  O email não pode ser alterado
                </span>
              </div>

              <div className="perfil-form-group">
                <label className="perfil-label">Nome Completo</label>
                <div className="perfil-input-wrapper">
                  <FiUser className="perfil-input-icon" />
                  <input
                    type="text"
                    className="perfil-input"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div className="perfil-form-group">
                <label className="perfil-label">Nome da Empresa</label>
                <div className="perfil-input-wrapper">
                  <FiBriefcase className="perfil-input-icon" />
                  <input
                    type="text"
                    className="perfil-input"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company_name: e.target.value,
                      })
                    }
                    placeholder="Nome da sua startup"
                  />
                </div>
              </div>

              <div className="perfil-form-group">
                <label className="perfil-label">Telefone</label>
                <div className="perfil-input-wrapper">
                  <FiPhone className="perfil-input-icon" />
                  <input
                    type="tel"
                    className="perfil-input"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="perfil-form-actions">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                  style={{ gap: '0.5rem' }}
                >
                  {!loading && <FiSave size={20} />}
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Account Info */}
          <div className="perfil-info-card">
            <h2 className="perfil-form-title">Informações da Conta</h2>
            <div className="perfil-info-list">
              <div className="perfil-info-item">
                <span className="perfil-info-label">Data de Cadastro</span>
                <span className="perfil-info-value">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                    : '-'}
                </span>
              </div>
              <div className="perfil-info-item">
                <span className="perfil-info-label">Última Atualização</span>
                <span className="perfil-info-value">
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString('pt-BR')
                    : '-'}
                </span>
              </div>
              <div className="perfil-info-item">
                <span className="perfil-info-label">Status da Conta</span>
                <span className="perfil-status-badge">Ativa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
