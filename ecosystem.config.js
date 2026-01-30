module.exports = {
  apps: [
    {
      name: 'whatsapp-automation',
      script: './index.js',
      
      // Configurações de execução
      instances: 1,
      exec_mode: 'fork',
      
      // Auto-restart
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Logs
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      
      // Variáveis de ambiente (opcional)
      env: {
        NODE_ENV: 'production',
        TZ: 'America/Sao_Paulo',
      },
      
      // Configurações de memória
      max_memory_restart: '500M',
      
      // Timeout para restart
      kill_timeout: 5000,
      listen_timeout: 10000,
      
      // Configurações avançadas
      restart_delay: 5000,
      exp_backoff_restart_delay: 100,
    },
  ],
};
