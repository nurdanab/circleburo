// src/components/PrerenderManager.jsx
import { useEffect } from 'react';

const PrerenderManager = () => {
  useEffect(() => {
    // Скрываем prerendered контент после загрузки React
    const prerenderedContent = document.getElementById('prerendered-content');
    if (prerenderedContent) {
      prerenderedContent.style.display = 'none';
    }

    // Удаляем loading экран если есть
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }

    // Показываем основной контент
    const root = document.getElementById('root');
    if (root) {
      root.style.opacity = '1';
    }
  }, []);

  return null; // Этот компонент не рендерит ничего
};

export default PrerenderManager;