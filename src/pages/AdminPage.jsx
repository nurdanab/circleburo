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
  RefreshCw
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
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

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
    } catch (err) {
      console.error('Error loading leads:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // Обновление статуса лида
  const updateLeadStatus = async (leadId, newStatus) => {
    setUpdating(leadId);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

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
${statusEmoji[newStatus]} Статус заявки обновлен

Имя: ${lead.name}
Телефон: +${lead.phone}
Дата: ${new Date(lead.meeting_date).toLocaleDateString('ru-RU')}
Время: ${lead.meeting_time}
Новый статус: ${STATUS_LABELS[newStatus]}
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

  // Фильтрация лидов
  const filteredLeads = leads.filter(lead => {
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
      'Создано': new Date(lead.created_at).toLocaleString('ru-RU')
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Админ панель - Управление лидами
          </h1>
          <p className="text-gray-600">
            Всего заявок: {leads.length} | Отфильтровано: {filteredLeads.length}
          </p>
        </div>

        {/* Панель управления */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по имени или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Фильтры */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value={BOOKING_STATUSES.PENDING}>В ожидании</option>
                <option value={BOOKING_STATUSES.CONFIRMED}>Подтвержденные</option>
                <option value={BOOKING_STATUSES.CANCELLED}>Отмененные</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </motion.button>
              
              <motion.button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Лидов не найдено</p>
              <p className="text-gray-400">Попробуйте изменить фильтры поиска</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контакты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Встреча
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {lead.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            +{lead.phone}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {new Date(lead.meeting_date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
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
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {lead.status !== BOOKING_STATUSES.CONFIRMED && (
                            <motion.button
                              onClick={() => updateLeadStatus(lead.id, BOOKING_STATUSES.CONFIRMED)}
                              disabled={updating === lead.id}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {updating === lead.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Подтвердить
                            </motion.button>
                          )}
                          
                          {lead.status !== BOOKING_STATUSES.CANCELLED && (
                            <motion.button
                              onClick={() => updateLeadStatus(lead.id, BOOKING_STATUSES.CANCELLED)}
                              disabled={updating === lead.id}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {updating === lead.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              Отменить
                            </motion.button>
                          )}

                          {lead.status === BOOKING_STATUSES.CANCELLED && (
                            <motion.button
                              onClick={() => updateLeadStatus(lead.id, BOOKING_STATUSES.PENDING)}
                              disabled={updating === lead.id}
                              className="flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white text-xs rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {updating === lead.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3" />
                              )}
                              Восстановить
                            </motion.button>
                          )}
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">В ожидании</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {leads.filter(lead => lead.status === BOOKING_STATUSES.PENDING).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Подтверждено</p>
                <p className="text-2xl font-bold text-green-600">
                  {leads.filter(lead => lead.status === BOOKING_STATUSES.CONFIRMED).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Отменено</p>
                <p className="text-2xl font-bold text-red-600">
                  {leads.filter(lead => lead.status === BOOKING_STATUSES.CANCELLED).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;