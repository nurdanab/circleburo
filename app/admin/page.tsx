"use client";

import { useState, useEffect } from "react";
import { api, Lead } from "@/lib/api";
import styles from "./admin.module.scss";

const BOOKING_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
} as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "В ожидании",
  confirmed: "Подтверждено",
  cancelled: "Отменено",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [savingNotes, setSavingNotes] = useState<number | null>(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editNotes, setEditNotes] = useState<Record<number, string>>({});

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem("adminAuth", "true");
    } else {
      setAuthError("Неверный пароль");
    }
  };

  // Check auth on load
  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load leads
  const loadLeads = async () => {
    setLoading(true);
    const result = await api.getAllLeads();

    if (result.error) {
      setError("Ошибка загрузки данных");
    } else if (result.data) {
      setLeads(result.data);
      const initialNotes: Record<number, string> = {};
      result.data.forEach((lead) => {
        if (lead.id) {
          initialNotes[lead.id] = lead.notes || "";
        }
      });
      setEditNotes(initialNotes);
    }
    setLoading(false);
  };

  // Update lead status
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    setUpdating(leadId);
    const result = await api.updateLead(leadId, { status: newStatus as Lead["status"] });

    if (result.error) {
      setError("Ошибка обновления статуса");
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus as Lead["status"] } : lead
        )
      );
    }
    setUpdating(null);
  };

  // Save notes
  const saveNotes = async (leadId: number) => {
    setSavingNotes(leadId);
    const result = await api.updateLead(leadId, { notes: editNotes[leadId] });

    if (result.error) {
      setError("Ошибка сохранения заметок");
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, notes: editNotes[leadId] } : lead
        )
      );
    }
    setSavingNotes(null);
  };

  // Delete lead
  const deleteLead = async (leadId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту заявку?")) return;

    setUpdating(leadId);
    const result = await api.deleteLead(leadId);

    if (result.error) {
      setError("Ошибка удаления заявки");
    } else {
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    }
    setUpdating(null);
  };

  // Sort handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort leads
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      const matchesDate =
        dateFilter === "all" ||
        (() => {
          const leadDate = new Date(lead.meeting_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);

          switch (dateFilter) {
            case "today":
              return leadDate.toDateString() === today.toDateString();
            case "tomorrow":
              return leadDate.toDateString() === tomorrow.toDateString();
            case "week":
              return leadDate >= today && leadDate <= weekFromNow;
            case "past":
              return leadDate < today;
            default:
              return true;
          }
        })();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "phone":
          aValue = a.phone;
          bValue = b.phone;
          break;
        case "meeting_date":
          aValue = new Date(a.meeting_date + "T" + a.meeting_time);
          bValue = new Date(b.meeting_date + "T" + b.meeting_time);
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          aValue = new Date(a.created_at || "");
          bValue = new Date(b.created_at || "");
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Export to CSV
  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;

    const csvData = filteredLeads.map((lead) => ({
      ID: lead.id,
      Имя: lead.name,
      Телефон: `+${lead.phone}`,
      "Дата встречи": lead.meeting_date,
      "Время встречи": lead.meeting_time,
      Статус: STATUS_LABELS[lead.status || "pending"],
      Создано: lead.created_at ? new Date(lead.created_at).toLocaleString("ru-RU") : "",
      Заметки: lead.notes || "",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Load leads on auth
  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [isAuthenticated]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      loadLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Админ панель</h1>
          <p className={styles.loginSubtitle}>Введите пароль для доступа</p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.field}>
              <label htmlFor="admin-password" className={styles.label}>
                Пароль
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Введите пароль"
                autoFocus
              />
            </div>

            {authError && <div className={styles.errorMessage}>{authError}</div>}

            <button type="submit" className={styles.loginBtn}>
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Админ панель</h1>
          <p className={styles.subtitle}>
            Всего заявок: {leads.length} | Отфильтровано: {filteredLeads.length}
          </p>
        </div>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem("adminAuth");
          }}
          className={styles.logoutBtn}
        >
          Выйти
        </button>
      </header>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Поиск по имени или телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.select}
          >
            <option value="all">Все статусы</option>
            <option value="pending">В ожидании</option>
            <option value="confirmed">Подтвержденные</option>
            <option value="cancelled">Отмененные</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.select}
          >
            <option value="all">Все даты</option>
            <option value="today">Сегодня</option>
            <option value="tomorrow">Завтра</option>
            <option value="week">На неделе</option>
            <option value="past">Прошедшие</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button onClick={loadLeads} className={styles.refreshBtn}>
            Обновить
          </button>
          <button onClick={exportToCSV} className={styles.exportBtn}>
            Экспорт CSV
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        {filteredLeads.length === 0 ? (
          <div className={styles.empty}>
            <p>Лидов не найдено</p>
            <span>Попробуйте изменить фильтры поиска</span>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className={styles.sortable}>
                  Клиент {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("phone")} className={styles.sortable}>
                  Телефон {sortField === "phone" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("meeting_date")} className={styles.sortable}>
                  Встреча {sortField === "meeting_date" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("status")} className={styles.sortable}>
                  Статус {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Заметки</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className={styles.clientInfo}>
                      <span className={styles.clientName}>{lead.name}</span>
                      <span className={styles.clientId}>ID: {lead.id}</span>
                    </div>
                  </td>
                  <td>+{lead.phone}</td>
                  <td>
                    <div className={styles.meetingInfo}>
                      <span>
                        {new Date(lead.meeting_date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span>{lead.meeting_time}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[lead.status || "pending"]}`}>
                      {STATUS_LABELS[lead.status || "pending"]}
                    </span>
                  </td>
                  <td>
                    <textarea
                      className={styles.notesInput}
                      value={editNotes[lead.id || 0] || ""}
                      onChange={(e) =>
                        setEditNotes({ ...editNotes, [lead.id || 0]: e.target.value })
                      }
                      placeholder="Заметки..."
                    />
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => lead.id && saveNotes(lead.id)}
                        disabled={savingNotes === lead.id}
                        className={styles.saveBtn}
                      >
                        {savingNotes === lead.id ? "..." : "Сохранить"}
                      </button>

                      {lead.status !== BOOKING_STATUSES.CONFIRMED && (
                        <button
                          onClick={() => lead.id && updateLeadStatus(lead.id, BOOKING_STATUSES.CONFIRMED)}
                          disabled={updating === lead.id}
                          className={styles.confirmBtn}
                        >
                          {updating === lead.id ? "..." : "Подтвердить"}
                        </button>
                      )}

                      {lead.status !== BOOKING_STATUSES.CANCELLED && (
                        <button
                          onClick={() => lead.id && updateLeadStatus(lead.id, BOOKING_STATUSES.CANCELLED)}
                          disabled={updating === lead.id}
                          className={styles.cancelBtn}
                        >
                          {updating === lead.id ? "..." : "Отменить"}
                        </button>
                      )}

                      {lead.status === BOOKING_STATUSES.CANCELLED && (
                        <button
                          onClick={() => lead.id && updateLeadStatus(lead.id, BOOKING_STATUSES.PENDING)}
                          disabled={updating === lead.id}
                          className={styles.restoreBtn}
                        >
                          {updating === lead.id ? "..." : "Восстановить"}
                        </button>
                      )}

                      <button
                        onClick={() => lead.id && deleteLead(lead.id)}
                        disabled={updating === lead.id}
                        className={styles.deleteBtn}
                      >
                        {updating === lead.id ? "..." : "Удалить"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>В ожидании</span>
          <span className={styles.statValue}>
            {leads.filter((l) => l.status === BOOKING_STATUSES.PENDING).length}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Подтверждено</span>
          <span className={styles.statValue}>
            {leads.filter((l) => l.status === BOOKING_STATUSES.CONFIRMED).length}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Отменено</span>
          <span className={styles.statValue}>
            {leads.filter((l) => l.status === BOOKING_STATUSES.CANCELLED).length}
          </span>
        </div>
      </div>
    </div>
  );
}
