"use client";

import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import type { ContentBlock } from "@/lib/types/blog";
import styles from "./BlockRenderer.module.scss";

interface BlockRendererProps {
  blocks: ContentBlock[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={styles.content}>
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <p key={block.id} className={styles.text}>
                {block.data.text}
              </p>
            );

          case "paragraph":
            return (
              <div
                key={block.id}
                className={styles.paragraph}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );

          case "heading":
            if (block.data.level === 2) {
              return (
                <h2 key={block.id} className={styles.h2}>
                  {block.data.text}
                </h2>
              );
            }
            return (
              <h3 key={block.id} className={styles.h3}>
                {block.data.text}
              </h3>
            );

          case "image":
            return (
              <figure key={block.id} className={styles.figure}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={getMediaUrl(block.data.url)}
                    alt={block.data.alt}
                    fill
                    sizes="(max-width: 800px) 100vw, 800px"
                    className={styles.image}
                  />
                </div>
                {block.data.caption && (
                  <figcaption className={styles.caption}>
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote key={block.id} className={styles.quote}>
                <p>{block.data.text}</p>
                {block.data.author && (
                  <cite className={styles.author}>— {block.data.author}</cite>
                )}
              </blockquote>
            );

          case "list":
            if (block.data.style === "ordered") {
              return (
                <ol key={block.id} className={styles.list}>
                  {block.data.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={block.id} className={styles.list}>
                {block.data.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
