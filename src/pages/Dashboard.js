import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiClock,
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    testing: 0,
    clients: 0,
    conversionRate: 0,
    totalLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Buscar todos os leads do usuário
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calcular estatísticas
      const testing = leads.filter((l) => l.stage === 'testando').length;
      const clients = leads.filter((l) => l.stage === 'cliente').length;
      const totalLeads = leads.length;
      const conversionRate =
        totalLeads > 0 ? ((clients / totalLeads) * 100).toFixed(1) : 0;

      setStats({
        testing,
        clients,
        conversionRate,
        totalLeads,
      });

      // Pegar os 5 leads mais recentes
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageLabel = (stage) => {
    const stages = {
      conversando: 'Conversando',
      demo_agendada: 'Demo Agendada',
      testando: 'Testando',
      cliente: 'Cliente',
    };
    return stages[stage] || stage;
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
      <div className="dashboard-loading">
        <div className="loading-spinner loading-spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do seu pipeline de vendas</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <p className="stat-title">Testando</p>
              <p className="stat-value text-primary">{stats.testing}</p>
              <p className="stat-description">Usuários em trial/beta</p>
            </div>
            <div className="stat-icon text-primary">
              <FiClock size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <p className="stat-title">Clientes</p>
              <p className="stat-value text-success">{stats.clients}</p>
              <p className="stat-description">Convertidos e pagando</p>
            </div>
            <div className="stat-icon text-success">
              <FiCheckCircle size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <p className="stat-title">Taxa de Conversão</p>
              <p className="stat-value text-secondary">{stats.conversionRate}%</p>
              <p className="stat-description">De leads para clientes</p>
            </div>
            <div className="stat-icon text-secondary">
              <FiTrendingUp size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <p className="stat-title">Total de Leads</p>
              <p className="stat-value text-info">{stats.totalLeads}</p>
              <p className="stat-description">Todos os estágios</p>
            </div>
            <div className="stat-icon text-info">
              <FiUsers size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="recent-leads-card">
        <div className="recent-leads-header">
          <h2 className="recent-leads-title">Leads Recentes</h2>
          <Link to="/leads" className="btn btn-primary btn-sm">
            Ver Todos
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="empty-state">
            <FiUsers size={48} className="empty-state-icon" />
            <p className="empty-state-text">Nenhum lead cadastrado ainda</p>
            <Link to="/kanban" className="btn btn-primary btn-sm">
              Adicionar Primeiro Lead
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Estágio</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-semibold">{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.company || '-'}</td>
                    <td>
                      <span className={`badge ${getStageColor(lead.stage)}`}>
                        {getStageLabel(lead.stage)}
                      </span>
                    </td>
                    <td>
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
