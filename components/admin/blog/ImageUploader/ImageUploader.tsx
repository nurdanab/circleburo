"use client";

import { useState, useRef, useCallback } from "react";
import { blogAdminApi } from "@/lib/blogApi";
import styles from "./ImageUploader.module.scss";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  placeholder = "Перетащите изображение сюда",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Разрешены только JPEG, PNG, GIF и WebP");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Файл слишком большой (максимум 10MB)");
      return;
    }

    setUploading(true);
    setError("");

    const result = await blogAdminApi.uploadImage(file);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      onChange(result.data.url);
    }

    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.uploader}>
      {value ? (
        <div className={styles.preview}>
          <img src={value} alt="Preview" className={styles.image} />
          <div className={styles.overlay}>
            <div className={styles.overlayActions}>
              <button
                type="button"
                className={styles.changeBtn}
                onClick={handleClick}
              >
                Заменить
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={handleRemove}
              >
                Удалить
              </button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${dragActive ? styles.active : ""} ${
            uploading ? styles.uploading : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleChange}
            className={styles.input}
          />

          {uploading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Загрузка...</p>
            </div>
          ) : (
            <>
              <div className={styles.icon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
              </div>
              <div className={styles.uploadContent}>
                <p className={styles.text}>{placeholder}</p>
                <span className={styles.hint}>или нажмите для выбора</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL input as fallback */}
      <div className={styles.urlSection}>
        <span className={styles.urlLabel}>или вставьте ссылку</span>
        <input
          type="text"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://..."
          className={styles.urlField}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
