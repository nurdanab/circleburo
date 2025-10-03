// src/hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';
import { getConnectionInfo, onConnectionChange } from '../utils/networkDetection';

/**
 * React Hook для мониторинга статуса сетевого соединения
 * @returns {Object} Информация о соединении
 */
export const useNetworkStatus = () => {
  const [connectionInfo, setConnectionInfo] = useState(() => getConnectionInfo());

  useEffect(() => {
    // Подписываемся на изменения соединения
    const unsubscribe = onConnectionChange((info) => {
      setConnectionInfo(info);

      if (import.meta.env.DEV) {
        console.log('Network connection changed:', info);
      }
    });

    return unsubscribe;
  }, []);

  return connectionInfo;
};

export default useNetworkStatus;
