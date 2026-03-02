"use client";

import { useState, useEffect } from "react";
import ArticleEditor from "@/components/admin/blog/ArticleEditor";
import styles from "../blogAdmin.module.scss";

export default function NewArticlePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

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

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Blog CMS</h1>
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

  return <ArticleEditor />;
}
