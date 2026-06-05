import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);

// Registrar Service Worker para notificaciones y PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW registrado:', reg.scope);
        // Chequear productos urgentes al abrir la app
        checkAndNotify(reg);
      })
      .catch(err => console.log('SW error:', err));
  });
}

function checkAndNotify(reg) {
  if (Notification.permission !== 'granted') return;
  try {
    const productos  = JSON.parse(localStorage.getItem('vc_productos') || '[]');
    const config     = JSON.parse(localStorage.getItem('vc_config') || '{}');
    const diasRetiro = config.diasRetiro || 15;
    const nombre     = localStorage.getItem('vc_nombre') || '';

    const urgentes = productos.filter(p => {
      const now = new Date(); now.setHours(0,0,0,0);
      const exp = new Date(p.vencimiento + 'T00:00:00');
      const days = Math.round((exp - now) / 86400000);
      return days <= diasRetiro;
    });

    if (urgentes.length > 0) {
      reg.showNotification('VencControl 📦', {
        body: `⚠️ ${urgentes.length} producto${urgentes.length>1?'s':''} para retirar hoy`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'venccontrol-alert',
        renotify: false,
      });
    }
  } catch(e) {}
}
