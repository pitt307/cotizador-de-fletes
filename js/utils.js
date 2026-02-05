const Utils = {
    formatCurrency(amount, currency = 'PEN') {
        const symbols = {
            USD: '$',
            PEN: 'S/',
            EUR: '€'
        };
        return `${symbols[currency]} ${parseFloat(amount).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    },
    formatNumber(number, decimals = 2) {
        return parseFloat(number).toFixed(decimals);
    },
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    formatDate(date = new Date()) {
        return new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            background: colors[type],
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease',
            maxWidth: '350px',
            fontSize: '0.9rem'
        });
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    isValidNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
    },
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copiado al portapapeles', 'success');
        } catch (err) {
            this.showNotification('Error al copiar', 'error');
        }
    },
    downloadJSON(data, filename = 'cotizacion.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Archivo descargado', 'success');
    }
};

if (!document.querySelector('#utils-styles')) {
    const style = document.createElement('style');
    style.id = 'utils-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}