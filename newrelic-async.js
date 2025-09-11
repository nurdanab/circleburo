// NewRelic асинхронная загрузка
(function() {
  // Инициализация NewRelic конфигурации
  window.NREUM||(NREUM={});
  NREUM.init={distributed_tracing:{enabled:true},privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]}};
  NREUM.loader_config={accountID:"7084244",trustKey:"7084244",agentID:"1120444680",licenseKey:"NRJS-08cdc20db091694e17a",applicationID:"1120444680"};
  NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"NRJS-08cdc20db091694e17a",applicationID:"1120444680",sa:1};

  // Создаем скрипт NewRelic асинхронно
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://js-agent.newrelic.com/nr-loader-spa-1.296.0.min.js';
  script.defer = true;
  
  // Добавляем скрипт в head когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      document.head.appendChild(script);
    });
  } else {
    document.head.appendChild(script);
  }
})();