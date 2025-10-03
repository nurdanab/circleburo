// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Save
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  CANCELLED: 'cancelled'
};

const STATUS_LABELS = {
  [BOOKING_STATUSES.PENDING]: 'Pending',
  [BOOKING_STATUSES.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUSES.CANCELLED]: 'Cancelled'
};

const STATUS_COLORS = {
  [BOOKING_STATUSES.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400'
  },
  [BOOKING_STATUSES.CONFIRMED]: {
    bg: 'bg-green-100',
    text: 'text-green-800', 
    border: 'border-green-200',
    dot: 'bg-green-400'
  },
  [BOOKING_STATUSES.CANCELLED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-400'
  }
};

const AdminPage = () => {
  if (import.meta.env.DEV) {
    console.log('🔥 AdminPage is rendering!');
  }

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [savingNotes, setSavingNotes] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editNotes, setEditNotes] = useState({});

  // Функция сортировки
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Загрузка лидов
  const loadLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      const initialNotes = {};
      data.forEach(lead => {
        initialNotes[lead.id] = lead.notes || '';
      });
      setEditNotes(initialNotes);
    } catch (err) {
      console.error('Error loading leads:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadData = async (leadId, newStatus) => {
    if (import.meta.env.DEV) {
      console.log('Updating lead:', leadId, 'to status:', newStatus);
    }
    setUpdating(leadId);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', leadId);

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log('Lead status updated successfully');
      }

      // Обновляем локальное состояние
      setLeads(prev => prev.map(lead =>
        lead.id === leadId
          ? { ...lead, status: newStatus }
          : lead
      ));

      // Отправляем уведомление в Telegram
      await sendStatusUpdateNotification(leadId, newStatus);

    } catch (err) {
      console.error('Error updating lead status:', err);
      setError('Ошибка обновления статуса');
    } finally {
      setUpdating(null);
    }
  };
  
  // Новая функция для сохранения только заметок
  const saveNotes = async (leadId) => {
    setSavingNotes(leadId); 
    try {
      const notesToUpdate = editNotes[leadId];
      const { error } = await supabase
        .from('leads')
        .update({ notes: notesToUpdate, updated_at: new Date() })
        .eq('id', leadId);

      if (error) throw error;

      // Обновляем локальное состояние только для заметок
      setLeads(prev => prev.map(lead =>
        lead.id === leadId
          ? { ...lead, notes: notesToUpdate }
          : lead
      ));

      if (import.meta.env.DEV) {
        console.log(`Notes for lead ${leadId} saved successfully.`);
      }

    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Ошибка сохранения заметок');
    } finally {
      setSavingNotes(null); // Скрываем индикатор сохранения
    }
  };

  // Функция удаления лида
  const deleteLead = async (leadId) => {
    setUpdating(leadId);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log('Lead deleted successfully');
      }

      // Удаляем из локального состояния
      setLeads(prev => prev.filter(lead => lead.id !== leadId));

      // Отправляем уведомление об удалении в Telegram
      await sendDeletionNotification(leadId);

    } catch (err) {
      console.error('Error deleting lead:', err);
      setError('Ошибка удаления заявки');
    } finally {
      setUpdating(null);
    }
  };

  // Отправка уведомления об удалении в Telegram
  const sendDeletionNotification = async (leadId) => {
    const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    try {
      const message = `
🗑️ Заявка удалена!

ID: ${leadId}
Время удаления: ${new Date().toLocaleString('ru-RU')}
      `.trim();

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
    } catch (err) {
      console.error('Error sending deletion notification:', err);
    }
  };

  // Отправка уведомления об изменении статуса в Telegram
  const sendStatusUpdateNotification = async (leadId, newStatus) => {
    const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const statusEmoji = {
        [BOOKING_STATUSES.PENDING]: '⏳',
        [BOOKING_STATUSES.CONFIRMED]: '✅',
        [BOOKING_STATUSES.CANCELLED]: '❌'
      };

      const message = `
${statusEmoji[newStatus]} new!

Имя: ${lead.name}
Телефон: +${lead.phone}
Дата: ${new Date(lead.meeting_date).toLocaleDateString('ru-RU')}
Время: ${lead.meeting_time}
Статус: ${STATUS_LABELS[newStatus]}
      `.trim();

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
    } catch (err) {
      console.error('Error sending status update notification:', err);
    }
  };

  // Фильтрация и сортировка лидов
  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      const matchesDate = dateFilter === 'all' || (() => {
        const leadDate = new Date(lead.meeting_date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);

        switch (dateFilter) {
          case 'today':
            return leadDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return leadDate.toDateString() === tomorrow.toDateString();
          case 'week':
            return leadDate >= today && leadDate <= weekFromNow;
          case 'past':
            return leadDate < today;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'phone':
          aValue = a.phone;
          bValue = b.phone;
          break;
        case 'meeting_date':
          aValue = new Date(a.meeting_date + 'T' + a.meeting_time);
          bValue = new Date(b.meeting_date + 'T' + b.meeting_time);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Экспорт данных в CSV
  const exportToCSV = () => {
    const csvData = filteredLeads.map(lead => ({
      'ID': lead.id,
      'Имя': lead.name,
      'Телефон': `+${lead.phone}`,
      'Дата встречи': lead.meeting_date,
      'Время встречи': lead.meeting_time,
      'Статус': STATUS_LABELS[lead.status],
      'Создано': new Date(lead.created_at).toLocaleString('ru-RU'),
      'Заметки': lead.notes || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Компонент для заголовка с сортировкой
  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  useEffect(() => {
    loadLeads();
  }, []);

  // Периодическое обновление данных в админ панели
  useEffect(() => {
    const interval = setInterval(() => {
      loadLeads();
    }, 30000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin admin-text-secondary" />
          <p className="admin-text-secondary">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style dangerouslySetInnerHTML={{__html: `
        /* Минималистичный черно-белый дизайн */
        .admin-container {
          background-color: #ffffff;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .admin-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .admin-input {
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          color: #1f2937;
        }

        .admin-input:focus {
          border-color: #374151;
          box-shadow: 0 0 0 2px rgba(55, 65, 81, 0.1);
        }

        .admin-table {
          background-color: #ffffff;
        }

        .admin-table-header {
          background-color: #f9fafb;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .admin-table-row {
          border-bottom: 1px solid #f3f4f6;
        }

        .admin-table-row:hover {
          background-color: #f9fafb;
        }

        .admin-text-primary { color: #111827; }
        .admin-text-secondary { color: #6b7280; }
        .admin-text-muted { color: #9ca3af; }

        .admin-border { border-color: #e5e7eb; }

        /* Цветные кнопки для акцентов */
        .admin-btn-primary {
          background-color: #3b82f6;
          color: #ffffff;
          border: none;
          transition: background-color 0.2s ease;
        }

        .admin-btn-primary:hover {
          background-color: #2563eb;
        }

        .admin-btn-success {
          background-color: #10b981;
          color: #ffffff;
          border: none;
          transition: background-color 0.2s ease;
        }

        .admin-btn-success:hover {
          background-color: #059669;
        }

        .admin-btn-warning {
          background-color: #f59e0b;
          color: #ffffff;
          border: none;
          transition: background-color 0.2s ease;
        }

        .admin-btn-warning:hover {
          background-color: #d97706;
        }

        .admin-btn-danger {
          background-color: #ef4444;
          color: #ffffff;
          border: none;
          transition: background-color 0.2s ease;
        }

        .admin-btn-danger:hover {
          background-color: #dc2626;
        }

        .admin-btn-neutral {
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          transition: all 0.2s ease;
        }

        .admin-btn-neutral:hover {
          background-color: #e5e7eb;
          border-color: #9ca3af;
        }
      `}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 admin-container">
        {/* Заголовок */}
        <div className="mb-8 py-6 border-b admin-border">
          <h1 className="text-2xl font-semibold admin-text-primary mb-2">
            Админ панель
          </h1>
          <p className="admin-text-secondary text-sm">
            Всего заявок: {leads.length} | Отфильтровано: {filteredLeads.length}
          </p>
        </div>

        {/* Панель управления */}
        <div className="admin-card rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по имени или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 admin-input rounded-lg focus:outline-none"
              />
            </div>

            {/* Фильтры */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 admin-input rounded-lg focus:outline-none"
              >
                <option value="all">Все статусы</option>
                <option value={BOOKING_STATUSES.PENDING}>В ожидании</option>
                <option value={BOOKING_STATUSES.CONFIRMED}>Подтвержденные</option>
                <option value={BOOKING_STATUSES.CANCELLED}>Отмененные</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 admin-input rounded-lg focus:outline-none"
              >
                <option value="all">Все даты</option>
                <option value="today">Сегодня</option>
                <option value="tomorrow">Завтра</option>
                <option value="week">На неделе</option>
                <option value="past">Прошедшие</option>
              </select>
            </div>

            {/* Действия */}
            <div className="flex gap-2">
              <motion.button
                onClick={loadLeads}
                className="flex items-center gap-2 px-4 py-2 rounded-lg admin-btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </motion.button>
              
              <motion.button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg admin-btn-success"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Экспорт CSV
              </motion.button>
            </div>
          </div>
        </div>

        {/* Ошибка */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Таблица лидов */}
        <div className="admin-card rounded-lg overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 admin-text-muted mx-auto mb-4" />
              <p className="admin-text-primary text-lg mb-2">Лидов не найдено</p>
              <p className="admin-text-muted">Попробуйте изменить фильтры поиска</p>
            </div>
          ) : (
            <div className="overflow-x-auto"> 
              <table className="w-full admin-table">
                <thead className="admin-table-header">
                  <tr>
                    <SortableHeader field="name">Клиент</SortableHeader>
                    <SortableHeader field="phone">Контакты</SortableHeader>
                    <SortableHeader field="meeting_date">Встреча</SortableHeader>
                    <SortableHeader field="status">Статус</SortableHeader>
                    <th className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider w-80">
                      Заметки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="admin-table divide-y admin-border">
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="admin-table-row transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 admin-text-secondary" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium admin-text-primary">
                              {lead.name}
                            </div>
                            <div className="text-sm admin-text-muted">
                              ID: {lead.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 admin-text-muted mr-2" />
                          <span className="text-sm admin-text-primary">
                            +{lead.phone}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 admin-text-muted mr-2" />
                            <span className="text-sm admin-text-primary">
                              {new Date(lead.meeting_date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 admin-text-muted mr-2" />
                            <span className="text-sm admin-text-primary">
                              {lead.meeting_time}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status].bg} ${STATUS_COLORS[lead.status].text} ${STATUS_COLORS[lead.status].border} border`}>
                          <div className={`w-1.5 h-1.5 ${STATUS_COLORS[lead.status].dot} rounded-full mr-1.5`}></div>
                          {STATUS_LABELS[lead.status]}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {/* Изменяем класс, чтобы сделать поле шире и разрешить перенос текста */}
                        <textarea
                          className="w-full h-20 text-sm admin-input rounded-md p-2 resize-y focus:outline-none"
                          value={editNotes[lead.id]}
                          onChange={(e) => setEditNotes({ ...editNotes, [lead.id]: e.target.value })}
                          placeholder="Заметки..."
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-col items-start min-w-[200px]">
                          {/* Кнопка для сохранения заметок */}
                          <motion.button
                            onClick={() => saveNotes(lead.id)}
                            disabled={savingNotes === lead.id}
                            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center admin-btn-neutral"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {savingNotes === lead.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Сохранить заметки
                          </motion.button>
                          
                          {/* Кнопка подтверждения */}
                          {lead.status !== BOOKING_STATUSES.CONFIRMED && (
                            <motion.button
                              onClick={() => updateLeadData(lead.id, BOOKING_STATUSES.CONFIRMED)}
                              disabled={updating === lead.id}
                              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center admin-btn-success"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {updating === lead.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              Подтвердить
                            </motion.button>
                          )}
                          
                          {/* Кнопка отмены */}
                          {lead.status !== BOOKING_STATUSES.CANCELLED && (
                            <motion.button
                              onClick={() => updateLeadData(lead.id, BOOKING_STATUSES.CANCELLED)}
                              disabled={updating === lead.id}
                              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center admin-btn-danger"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {updating === lead.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              Отменить
                            </motion.button>
                          )}

                          {/* Кнопка восстановления */}
                          {lead.status === BOOKING_STATUSES.CANCELLED && (
                            <motion.button
                              onClick={() => updateLeadData(lead.id, BOOKING_STATUSES.PENDING)}
                              disabled={updating === lead.id}
                              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center admin-btn-warning"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {updating === lead.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                              Восстановить
                            </motion.button>
                          )}

                          {/* Кнопка удаления */}
                          <motion.button
                            onClick={() => {
                              if (window.confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) {
                                deleteLead(lead.id);
                              }
                            }}
                            disabled={updating === lead.id}
                            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center admin-btn-danger"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {updating === lead.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Удалить
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="admin-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium admin-text-secondary">В ожидании</p>
                <p className="text-2xl font-semibold admin-text-primary">
                  {leads.filter(lead => lead.status === BOOKING_STATUSES.PENDING).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 admin-text-secondary" />
              </div>
            </div>
          </div>

          <div className="admin-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium admin-text-secondary">Подтверждено</p>
                <p className="text-2xl font-semibold admin-text-primary">
                  {leads.filter(lead => lead.status === BOOKING_STATUSES.CONFIRMED).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 admin-text-secondary" />
              </div>
            </div>
          </div>

          <div className="admin-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium admin-text-secondary">Отменено</p>
                <p className="text-2xl font-semibold admin-text-primary">
                  {leads.filter(lead => lead.status === BOOKING_STATUSES.CANCELLED).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 admin-text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;