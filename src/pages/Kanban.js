import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './Kanban.css';

const Kanban = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    stage: 'conversando',
    notes: '',
  });

  const stages = [
    { id: 'conversando', label: 'Conversando', color: 'info' },
    { id: 'demo_agendada', label: 'Demo Agendada', color: 'warning' },
    { id: 'testando', label: 'Testando', color: 'primary' },
    { id: 'cliente', label: 'Cliente', color: 'success' },
  ];

  useEffect(() => {
    loadLeads();
  }, [user]);

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

  const handleOpenModal = (lead = null, stage = 'conversando') => {
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
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        stage: stage,
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLead(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      stage: 'conversando',
      notes: '',
    });
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

  const handleStageChange = async (leadId, newStage) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage })
        .eq('id', leadId);

      if (error) throw error;
      await loadLeads();
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    // Adiciona uma classe visual ao card sendo arrastado
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedLead(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, stageId) => {
    e.preventDefault();
    setDraggedOverColumn(stageId);
  };

  const handleDragLeave = (e) => {
    // Verifica se realmente saiu da coluna
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    if (!draggedLead || draggedLead.stage === newStage) {
      setDraggedLead(null);
      return;
    }

    // Atualização otimista da UI
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === draggedLead.id ? { ...lead, stage: newStage } : lead
      )
    );

    // Atualiza no banco de dados
    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage })
        .eq('id', draggedLead.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
      // Reverte a mudança em caso de erro
      await loadLeads();
    }

    setDraggedLead(null);
  };

  const getLeadsByStage = (stageId) => {
    return leads.filter((lead) => lead.stage === stageId);
  };

  const toggleDropdown = (leadId) => {
    setActiveDropdown(activeDropdown === leadId ? null : leadId);
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
          <h1>Pipeline Kanban</h1>
          <p>Gerencie seus leads através do funil de vendas - Arraste e solte para mover</p>
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

      {/* Kanban Board */}
      <div className="kanban-board">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          const isOver = draggedOverColumn === stage.id;
          
          return (
            <div key={stage.id} className="kanban-column">
              <div className={`kanban-column-header ${stage.color}`}>
                <h3>{stage.label}</h3>
                <p>{stageLeads.length} leads</p>
              </div>
              <div
                className={`kanban-column-body ${isOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="lead-card"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="lead-card-header">
                      <h4 className="lead-card-title">{lead.name}</h4>
                      <div className="lead-card-menu">
                        <button
                          className="lead-card-menu-btn"
                          onClick={() => toggleDropdown(lead.id)}
                        >
                          •••
                        </button>
                        <div className={`lead-card-dropdown ${activeDropdown === lead.id ? 'active' : ''}`}>
                          <button onClick={() => {
                            handleOpenModal(lead);
                            setActiveDropdown(null);
                          }}>
                            <FiEdit2 size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(lead.id);
                              setActiveDropdown(null);
                            }}
                            className="delete"
                          >
                            <FiTrash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="lead-card-email">{lead.email}</p>
                    {lead.company && (
                      <p className="lead-card-company">{lead.company}</p>
                    )}
                    {lead.phone && (
                      <p className="lead-card-phone">📞 {lead.phone}</p>
                    )}
                    {lead.notes && (
                      <p className="lead-card-notes">{lead.notes}</p>
                    )}
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="empty-column">
                    <p>Arraste leads para cá</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
                <button type="button" onClick={handleCloseModal} className="btn">
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

export default Kanban;
