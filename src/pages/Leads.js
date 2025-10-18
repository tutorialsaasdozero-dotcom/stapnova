import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import './Kanban.css';

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    stage: 'conversando',
    notes: '',
    source: '',
  });

  const stages = [
    { id: 'conversando', label: 'Conversando' },
    { id: 'demo_agendada', label: 'Demo Agendada' },
    { id: 'testando', label: 'Testando' },
    { id: 'cliente', label: 'Cliente' },
  ];

  useEffect(() => {
    loadLeads();
  }, [user]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, filterStage]);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (filterStage !== 'all') {
      filtered = filtered.filter((lead) => lead.stage === filterStage);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.company &&
            lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLeads(filtered);
  };

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        position: lead.position || '',
        stage: lead.stage,
        notes: lead.notes || '',
        source: lead.source || '',
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        stage: 'conversando',
        notes: '',
        source: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLead(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLead) {
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', editingLead.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('leads').insert([
          {
            ...formData,
            user_id: user.id,
          },
        ]);

        if (error) throw error;
      }

      await loadLeads();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      alert('Erro ao salvar lead. Tente novamente.');
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', leadId);

      if (error) throw error;
      await loadLeads();
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      alert('Erro ao excluir lead. Tente novamente.');
    }
  };

  const getStageLabel = (stage) => {
    const stageObj = stages.find((s) => s.id === stage);
    return stageObj ? stageObj.label : stage;
  };

  const getStageColor = (stage) => {
    const colors = {
      conversando: 'badge-info',
      demo_agendada: 'badge-warning',
      testando: 'badge-primary',
      cliente: 'badge-success',
    };
    return colors[stage] || 'badge-ghost';
  };

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="loading-spinner loading-spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      {/* Header */}
      <div className="kanban-header">
        <div className="kanban-header-content">
          <h1>Leads</h1>
          <p>Gerencie todos os seus leads em um só lugar</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <FiPlus size={20} />
          Novo Lead
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="modal-form-grid">
            <div className="modal-form-group">
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--base-content-secondary)' }} />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou empresa..."
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-form-group">
              <select
                className="modal-select"
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
              >
                <option value="all">Todos os estágios</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--base-content-secondary)', marginTop: '0.5rem' }}>
            Mostrando {filteredLeads.length} de {leads.length} leads
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Telefone</th>
                  <th>Estágio</th>
                  <th>Origem</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p style={{ color: 'var(--base-content-secondary)' }}>
                        Nenhum lead encontrado
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="font-semibold">{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.company || '-'}</td>
                      <td>{lead.phone || '-'}</td>
                      <td>
                        <span className={`badge ${getStageColor(lead.stage)}`}>
                          {getStageLabel(lead.stage)}
                        </span>
                      </td>
                      <td>{lead.source || '-'}</td>
                      <td>
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenModal(lead)}
                            className="btn btn-ghost btn-sm"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--error)' }}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </h3>
              <button onClick={handleCloseModal} className="modal-close-btn">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-grid">
                <div className="modal-form-group">
                  <label className="modal-label">Nome *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Email *</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Telefone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Empresa</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Cargo</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Origem</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="LinkedIn, Site, Indicação..."
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Estágio *</label>
                <select
                  className="modal-select"
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData({ ...formData, stage: e.target.value })
                  }
                  required
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Observações</label>
                <textarea
                  className="modal-textarea"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Adicione observações sobre este lead..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLead ? 'Salvar' : 'Criar Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
