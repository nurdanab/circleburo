// src/analytics.js
import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-29PQZ4K7ZP';

export const initGA = () => {
  console.log('Инициализация Google Analytics');
  ReactGA.initialize(TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};