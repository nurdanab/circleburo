"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Lead } from "@/lib/api";
import { blogAdminApi } from "@/lib/blogApi";
import styles from "./admin.module.scss";

type TabType = "leads" | "blog" | "projects";

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

const BLOG_STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликовано",
};

const CATEGORY_LABELS: Record<string, string> = {
  branding: "Брендинг",
  marketing: "Маркетинг",
  design: "Дизайн",
  research: "Исследования",
  "case-studies": "Кейсы",
};

interface AdminArticle {
  id: number;
  slug: string;
  cover_image: string | null;
  category_id: number | null;
  category_slug: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  title_ru: string | null;
  title_en: string | null;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("leads");

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [savingNotes, setSavingNotes] = useState<number | null>(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editNotes, setEditNotes] = useState<Record<number, string>>({});

  // Blog state
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogStatusFilter, setBlogStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState<number | null>(null);

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  // Auth
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

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load leads
  const loadLeads = async () => {
    setLeadsLoading(true);
    const result = await api.getAllLeads();
    if (result.error) {
      setError("Ошибка загрузки данных");
    } else if (result.data) {
      setLeads(result.data);
      const initialNotes: Record<number, string> = {};
      result.data.forEach((lead) => {
        if (lead.id) initialNotes[lead.id] = lead.notes || "";
      });
      setEditNotes(initialNotes);
    }
    setLeadsLoading(false);
  };

  // Load articles
  const loadArticles = async () => {
    setBlogLoading(true);
    const result = await blogAdminApi.getArticles({
      status: blogStatusFilter !== "all" ? (blogStatusFilter as "draft" | "published") : undefined,
    });
    if (result.error) {
      setError("Ошибка загрузки статей");
    } else if (result.data) {
      setArticles(result.data.articles);
    }
    setBlogLoading(false);
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

  // Delete article
  const deleteArticle = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту статью?")) return;
    setDeleting(id);
    const result = await blogAdminApi.deleteArticle(id);
    if (result.error) {
      setError("Ошибка удаления статьи");
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
    setDeleting(null);
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
            case "today": return leadDate.toDateString() === today.toDateString();
            case "tomorrow": return leadDate.toDateString() === tomorrow.toDateString();
            case "week": return leadDate >= today && leadDate <= weekFromNow;
            case "past": return leadDate < today;
            default: return true;
          }
        })();
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      switch (sortField) {
        case "name": aValue = a.name.toLowerCase(); bValue = b.name.toLowerCase(); break;
        case "phone": aValue = a.phone; bValue = b.phone; break;
        case "meeting_date":
          aValue = new Date(a.meeting_date + "T" + a.meeting_time);
          bValue = new Date(b.meeting_date + "T" + b.meeting_time);
          break;
        case "status": aValue = a.status || ""; bValue = b.status || ""; break;
        default:
          aValue = new Date(a.created_at || "");
          bValue = new Date(b.created_at || "");
          break;
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Export CSV
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
        Object.values(row).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
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

  // Load data based on tab
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "leads") loadLeads();
      if (activeTab === "blog") loadArticles();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "blog") {
      loadArticles();
    }
  }, [blogStatusFilter]);

  // Auto-refresh leads
  useEffect(() => {
    if (!isAuthenticated || activeTab !== "leads") return;
    const interval = setInterval(() => loadLeads(), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Админ панель</h1>
          <p className={styles.loginSubtitle}>Введите пароль для доступа</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.field}>
              <label htmlFor="admin-password" className={styles.label}>Пароль</label>
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
            <button type="submit" className={styles.loginBtn}>Войти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Circle Admin</h1>
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

      {/* Tabs */}
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "leads" ? styles.active : ""}`}
          onClick={() => setActiveTab("leads")}
        >
          Заявки
          {leads.length > 0 && <span className={styles.badge}>{leads.length}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "blog" ? styles.active : ""}`}
          onClick={() => setActiveTab("blog")}
        >
          Блог
          {articles.length > 0 && <span className={styles.badge}>{articles.length}</span>}
        </button>
      </nav>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === "leads" && (
        <>
          {leadsLoading ? (
            <div className={styles.loadingInline}>
              <div className={styles.spinner} />
              <p>Загрузка заявок...</p>
            </div>
          ) : (
            <>
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
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
                    <option value="all">Все статусы</option>
                    <option value="pending">В ожидании</option>
                    <option value="confirmed">Подтвержденные</option>
                    <option value="cancelled">Отмененные</option>
                  </select>
                  <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={styles.select}>
                    <option value="all">Все даты</option>
                    <option value="today">Сегодня</option>
                    <option value="tomorrow">Завтра</option>
                    <option value="week">На неделе</option>
                    <option value="past">Прошедшие</option>
                  </select>
                </div>
                <div className={styles.actions}>
                  <button onClick={loadLeads} className={styles.refreshBtn}>Обновить</button>
                  <button onClick={exportToCSV} className={styles.exportBtn}>Экспорт CSV</button>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                {filteredLeads.length === 0 ? (
                  <div className={styles.empty}>
                    <p>Заявок не найдено</p>
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
                              <span>{new Date(lead.meeting_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</span>
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
                              onChange={(e) => setEditNotes({ ...editNotes, [lead.id || 0]: e.target.value })}
                              placeholder="Заметки..."
                            />
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button onClick={() => lead.id && saveNotes(lead.id)} disabled={savingNotes === lead.id} className={styles.saveBtn}>
                                {savingNotes === lead.id ? "..." : "Сохранить"}
                              </button>
                              {lead.status !== BOOKING_STATUSES.CONFIRMED && (
                                <button onClick={() => lead.id && updateLeadStatus(lead.id, BOOKING_STATUSES.CONFIRMED)} disabled={updating === lead.id} className={styles.confirmBtn}>
                                  {updating === lead.id ? "..." : "Подтвердить"}
                                </button>
                              )}
                              {lead.status !== BOOKING_STATUSES.CANCELLED && (
                                <button onClick={() => lead.id && updateLeadStatus(lead.id, BOOKING_STATUSES.CANCELLED)} disabled={updating === lead.id} className={styles.cancelBtn}>
                                  {updating === lead.id ? "..." : "Отменить"}
                                </button>
                              )}
                              {lead.status === BOOKING_STATUSES.CANCELLED && (
                                <button onClick={() => lead.id && updateLeadStatus(lead.id, BOOKING_STATUSES.PENDING)} disabled={updating === lead.id} className={styles.restoreBtn}>
                                  {updating === lead.id ? "..." : "Восстановить"}
                                </button>
                              )}
                              <button onClick={() => lead.id && deleteLead(lead.id)} disabled={updating === lead.id} className={styles.deleteBtn}>
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

              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>В ожидании</span>
                  <span className={styles.statValue}>{leads.filter((l) => l.status === BOOKING_STATUSES.PENDING).length}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Подтверждено</span>
                  <span className={styles.statValue}>{leads.filter((l) => l.status === BOOKING_STATUSES.CONFIRMED).length}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Отменено</span>
                  <span className={styles.statValue}>{leads.filter((l) => l.status === BOOKING_STATUSES.CANCELLED).length}</span>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Blog Tab */}
      {activeTab === "blog" && (
        <>
          {blogLoading ? (
            <div className={styles.loadingInline}>
              <div className={styles.spinner} />
              <p>Загрузка статей...</p>
            </div>
          ) : (
            <>
              <div className={styles.controls}>
                <div className={styles.filters}>
                  <select value={blogStatusFilter} onChange={(e) => setBlogStatusFilter(e.target.value)} className={styles.select}>
                    <option value="all">Все статусы</option>
                    <option value="draft">Черновики</option>
                    <option value="published">Опубликованные</option>
                  </select>
                </div>
                <div className={styles.actions}>
                  <button onClick={loadArticles} className={styles.refreshBtn}>Обновить</button>
                  <Link href="/admin/blog/new" className={styles.createBtn}>+ Новая статья</Link>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                {articles.length === 0 ? (
                  <div className={styles.empty}>
                    <p>Статей пока нет</p>
                    <span>Нажмите «+ Новая статья» чтобы создать</span>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Статья</th>
                        <th>Категория</th>
                        <th>Статус</th>
                        <th>Дата</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id}>
                          <td>
                            <div className={styles.articleInfo}>
                              <span className={styles.articleTitle}>{article.title_ru || article.title_en || article.slug}</span>
                              <span className={styles.articleSlug}>/{article.slug}</span>
                            </div>
                          </td>
                          <td>
                            {article.category_slug ? (
                              <span className={styles.category}>{CATEGORY_LABELS[article.category_slug] || article.category_slug}</span>
                            ) : (
                              <span className={styles.noCategory}>—</span>
                            )}
                          </td>
                          <td>
                            <span className={`${styles.status} ${styles[article.status]}`}>{BLOG_STATUS_LABELS[article.status]}</span>
                          </td>
                          <td>
                            <div className={styles.dateInfo}>
                              <span>{new Date(article.updated_at).toLocaleDateString("ru-RU")}</span>
                              <span className={styles.dateTime}>{new Date(article.updated_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <Link href={`/admin/blog/${article.id}/edit`} className={styles.editBtn}>Редактировать</Link>
                              <button onClick={() => deleteArticle(article.id)} disabled={deleting === article.id} className={styles.deleteBtn}>
                                {deleting === article.id ? "..." : "Удалить"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Всего статей</span>
                  <span className={styles.statValue}>{articles.length}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Опубликовано</span>
                  <span className={styles.statValue}>{articles.filter((a) => a.status === "published").length}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Черновики</span>
                  <span className={styles.statValue}>{articles.filter((a) => a.status === "draft").length}</span>
                </div>
              </div>
            </>
          )}
        </>
      )}

          </div>
  );
}
