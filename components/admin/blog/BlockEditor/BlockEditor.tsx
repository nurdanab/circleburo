"use client";

import { useState, useCallback } from "react";
import type { ContentBlock, BlockType } from "@/lib/types/blog";
import ImageUploader from "../ImageUploader";
import styles from "./BlockEditor.module.scss";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: "text", label: "Простой текст", icon: "T", description: "Обычный текст без оформления" },
  { type: "paragraph", label: "Параграф", icon: "¶", description: "С полоской слева, поддерживает форматирование" },
  { type: "heading", label: "Заголовок", icon: "H", description: "H2 или H3" },
  { type: "image", label: "Изображение", icon: "▣", description: "Картинка с подписью" },
  { type: "quote", label: "Цитата", icon: "„", description: "Выделенный текст" },
  { type: "list", label: "Список", icon: "•", description: "Маркированный или нумерованный" },
];

function generateId() {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = createEmptyBlock(type);
    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const createEmptyBlock = (type: BlockType): ContentBlock => {
    const id = generateId();

    switch (type) {
      case "text":
        return { id, type: "text", data: { text: "" } };
      case "paragraph":
        return { id, type: "paragraph", data: { text: "" } };
      case "heading":
        return { id, type: "heading", data: { text: "", level: 2 } };
      case "image":
        return { id, type: "image", data: { url: "", alt: "" } };
      case "quote":
        return { id, type: "quote", data: { text: "" } };
      case "list":
        return { id, type: "list", data: { style: "unordered", items: [""] } };
      default:
        return { id, type: "paragraph", data: { text: "" } };
    }
  };

  const updateBlock = (index: number, updatedBlock: ContentBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    // Add a slight delay to show the dragging state
    setTimeout(() => {
      const element = e.target as HTMLElement;
      element.classList.add(styles.dragging);
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    const element = e.target as HTMLElement;
    element.classList.remove(styles.dragging);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (dragIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedBlock);
    onChange(newBlocks);

    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [blocks, onChange]);

  return (
    <div className={styles.editor}>
      {blocks.length === 0 ? (
        <div className={styles.empty}>
          <p>Контент пока пуст</p>
          <span>Добавьте первый блок</span>
        </div>
      ) : (
        <div className={styles.blocks}>
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={`${styles.blockWrapper} ${
                draggedIndex === index ? styles.dragging : ""
              } ${dragOverIndex === index ? styles.dragOver : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className={styles.blockControls}>
                <div className={styles.dragHandle} title="Перетащите для перемещения">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="3" r="1.5" />
                    <circle cx="11" cy="3" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="13" r="1.5" />
                    <circle cx="11" cy="13" r="1.5" />
                  </svg>
                </div>
                <button
                  onClick={() => deleteBlock(index)}
                  className={`${styles.controlBtn} ${styles.deleteBtn}`}
                  title="Удалить"
                >
                  ×
                </button>
              </div>

              <div className={styles.blockContent}>
                <BlockInput
                  block={block}
                  onChange={(updated) => updateBlock(index, updated)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Block Button */}
      <div className={styles.addBlockWrapper}>
        <button
          className={styles.addBlockBtn}
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          + Добавить блок
        </button>

        {showAddMenu && (
          <div className={styles.addMenu}>
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                className={styles.addMenuItem}
                onClick={() => addBlock(bt.type)}
              >
                <span className={styles.menuIcon}>{bt.icon}</span>
                {bt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Block Input Component
interface BlockInputProps {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}

function BlockInput({ block, onChange }: BlockInputProps) {
  // Helper function to insert formatting tags
  const insertFormatting = (
    text: string,
    selectionStart: number,
    selectionEnd: number,
    tag: string
  ) => {
    const selectedText = text.substring(selectionStart, selectionEnd);
    const before = text.substring(0, selectionStart);
    const after = text.substring(selectionEnd);
    return `${before}<${tag}>${selectedText}</${tag}>${after}`;
  };

  switch (block.type) {
    case "text":
      return (
        <div className={styles.inputGroup}>
          <label className={styles.blockLabel}>Простой текст</label>
          <textarea
            value={block.data.text}
            onChange={(e) =>
              onChange({ ...block, data: { text: e.target.value } })
            }
            placeholder="Введите текст без форматирования..."
            className={styles.textarea}
            rows={3}
          />
        </div>
      );

    case "paragraph":
      return (
        <div className={styles.inputGroup}>
          <label className={styles.blockLabel}>Параграф</label>
          <div className={styles.formatToolbar}>
            <button
              type="button"
              className={styles.formatBtn}
              title="Жирный (выделите текст)"
              onClick={() => {
                const textarea = document.querySelector(
                  `[data-block-id="${block.id}"]`
                ) as HTMLTextAreaElement;
                if (textarea) {
                  const newText = insertFormatting(
                    block.data.text,
                    textarea.selectionStart,
                    textarea.selectionEnd,
                    "strong"
                  );
                  onChange({ ...block, data: { text: newText } });
                }
              }}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className={styles.formatBtn}
              title="Курсив (выделите текст)"
              onClick={() => {
                const textarea = document.querySelector(
                  `[data-block-id="${block.id}"]`
                ) as HTMLTextAreaElement;
                if (textarea) {
                  const newText = insertFormatting(
                    block.data.text,
                    textarea.selectionStart,
                    textarea.selectionEnd,
                    "em"
                  );
                  onChange({ ...block, data: { text: newText } });
                }
              }}
            >
              <em>I</em>
            </button>
          </div>
          <textarea
            data-block-id={block.id}
            value={block.data.text}
            onChange={(e) =>
              onChange({ ...block, data: { text: e.target.value } })
            }
            placeholder="Введите текст... (поддерживает <strong> и <em>)"
            className={styles.textarea}
            rows={3}
          />
          <span className={styles.hint}>
            Выделите текст и нажмите B или I для форматирования
          </span>
        </div>
      );

    case "heading":
      return (
        <div className={styles.inputGroup}>
          <div className={styles.headingHeader}>
            <label className={styles.blockLabel}>Заголовок</label>
            <select
              value={block.data.level}
              onChange={(e) =>
                onChange({
                  ...block,
                  data: { ...block.data, level: parseInt(e.target.value) as 2 | 3 },
                })
              }
              className={styles.levelSelect}
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </div>
          <input
            type="text"
            value={block.data.text}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, text: e.target.value } })
            }
            placeholder="Введите заголовок..."
            className={styles.input}
          />
        </div>
      );

    case "image":
      return (
        <div className={styles.inputGroup}>
          <label className={styles.blockLabel}>Изображение</label>
          <ImageUploader
            value={block.data.url}
            onChange={(url) =>
              onChange({ ...block, data: { ...block.data, url } })
            }
            placeholder="Перетащите или выберите изображение"
          />
          <input
            type="text"
            value={block.data.alt}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, alt: e.target.value } })
            }
            placeholder="Alt текст (для SEO и доступности)..."
            className={styles.input}
          />
          <input
            type="text"
            value={block.data.caption || ""}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, caption: e.target.value } })
            }
            placeholder="Подпись (опционально)..."
            className={styles.input}
          />
        </div>
      );

    case "quote":
      return (
        <div className={styles.inputGroup}>
          <label className={styles.blockLabel}>Цитата</label>
          <textarea
            value={block.data.text}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, text: e.target.value } })
            }
            placeholder="Текст цитаты..."
            className={styles.textarea}
            rows={2}
          />
          <input
            type="text"
            value={block.data.author || ""}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, author: e.target.value } })
            }
            placeholder="Автор (опционально)..."
            className={styles.input}
          />
        </div>
      );

    case "list":
      return (
        <div className={styles.inputGroup}>
          <div className={styles.listHeader}>
            <label className={styles.blockLabel}>Список</label>
            <select
              value={block.data.style}
              onChange={(e) =>
                onChange({
                  ...block,
                  data: {
                    ...block.data,
                    style: e.target.value as "ordered" | "unordered",
                  },
                })
              }
              className={styles.levelSelect}
            >
              <option value="unordered">Маркированный</option>
              <option value="ordered">Нумерованный</option>
            </select>
          </div>
          {block.data.items.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.listIndex}>
                {block.data.style === "ordered" ? `${idx + 1}.` : "•"}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...block.data.items];
                  newItems[idx] = e.target.value;
                  onChange({ ...block, data: { ...block.data, items: newItems } });
                }}
                placeholder="Пункт списка..."
                className={styles.listInput}
              />
              <button
                onClick={() => {
                  const newItems = block.data.items.filter((_, i) => i !== idx);
                  onChange({
                    ...block,
                    data: { ...block.data, items: newItems.length ? newItems : [""] },
                  });
                }}
                className={styles.removeItemBtn}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onChange({
                ...block,
                data: { ...block.data, items: [...block.data.items, ""] },
              });
            }}
            className={styles.addItemBtn}
          >
            + Добавить пункт
          </button>
        </div>
      );

    default:
      return null;
  }
}
