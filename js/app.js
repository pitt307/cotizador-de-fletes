const AppConfig = {
    name: 'Cotizador Express',
    version: '1.0.0',
    author: 'Daniel L.',
    defaultCurrency: 'PEN',
    defaultRate: 5.00,
    volumetricFactor: 5000
};
document.addEventListener('DOMContentLoaded', () => {
    console.log(`%c${AppConfig.name} v${AppConfig.version}`, 'color: #FF8C66; font-size: 16px; font-weight: bold;');
    console.log(`%cDesarrollado por ${AppConfig.author}`, 'color: #64748b; font-size: 12px;');
    
    initializeApp();
});
function initializeApp() {
    try {
        CurrencyManager.init();
        console.log('✓ Gestor de monedas inicializado');
        QuoteManager.init();
        console.log('✓ Gestor de cotizaciones inicializado');
        console.log(`  - Historial: ${QuoteManager.history.length} cotizaciones`);
        console.log(`  - Favoritos: ${QuoteManager.favorites.length} guardados`);
        QuoteUI.init();
        console.log('✓ Interfaz inicializada');
        setupGlobalListeners();
        console.log('✓ Listeners configurados');
        showWelcomeMessage();
        
        console.log('✅ Aplicación lista');
        
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
        Utils.showNotification('Error al cargar la aplicación', 'error');
    }
}
function setupGlobalListeners() {
    
    const rateInput = document.getElementById('rate');
    if (rateInput) {
        rateInput.addEventListener('focus', () => {
            CurrencyManager.updateCurrencySymbols();
        });
    }
 
    document.addEventListener('keydown', handleKeyboardShortcuts);
    window.addEventListener('storage', (e) => {
        if (e.key === QuoteManager.HISTORY_KEY) {
            QuoteManager.loadHistory();
            QuoteUI.renderHistory();
            Utils.showNotification('Historial actualizado desde otra pestaña', 'info');
        } else if (e.key === QuoteManager.FAVORITES_KEY) {
            QuoteManager.loadFavorites();
            QuoteUI.renderFavorites();
            Utils.showNotification('Favoritos actualizados desde otra pestaña', 'info');
        }
    });
    window.addEventListener('beforeunload', () => {
        QuoteManager.saveHistory();
        QuoteManager.saveFavorites();
    });
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        QuoteUI.handleCalculate();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('weight')?.focus();
    }
    if (e.key === 'Escape') {
        QuoteUI.clearForm();
    }
}


function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('cotizador_visited');
    
    if (!hasVisited) {
        setTimeout(() => {
            Utils.showNotification('¡Bienvenido al Cotizador Express! 🚀', 'success');
            localStorage.setItem('cotizador_visited', 'true');
        }, 500);
    }
}

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.AppDebug = {
        clearStorage: () => {
            localStorage.clear();
            location.reload();
            console.log('Storage limpiado');
        },
        showConfig: () => {
            console.table(AppConfig);
        },
        showStats: () => {
            console.log('📊 Estadísticas:');
            console.log(`  Historial: ${QuoteManager.history.length}`);
            console.log(`  Favoritos: ${QuoteManager.favorites.length}`);
            console.log(`  Moneda: ${CurrencyManager.currentCurrency}`);
        },
        exportHistory: () => {
            QuoteManager.exportHistory();
        },
        exportFavorites: () => {
            QuoteManager.exportFavorites();
        },
        simulate: (weight, length, width, height) => {
            document.getElementById('weight').value = weight;
            document.getElementById('length').value = length;
            document.getElementById('width').value = width;
            document.getElementById('height').value = height;
            QuoteUI.handleCalculate();
            console.log('Simulación ejecutada');
        }
    };
    
    console.log('%cModo Desarrollo Activado', 'color: #10b981; font-weight: bold;');
    console.log('Funciones disponibles:');
    console.log('  AppDebug.clearStorage() - Limpiar todo');
    console.log('  AppDebug.showConfig() - Ver configuración');
    console.log('  AppDebug.showStats() - Ver estadísticas');
    console.log('  AppDebug.exportHistory() - Exportar historial');
    console.log('  AppDebug.exportFavorites() - Exportar favoritos');
    console.log('  AppDebug.simulate(peso, largo, ancho, alto) - Simular cálculo');
    console.log('\nAtajos de teclado:');
    console.log('  Ctrl/Cmd + Enter: Calcular');
    console.log('  Ctrl/Cmd + K: Focus en peso');
    console.log('  Esc: Limpiar formulario');
}
window.addEventListener('error', (e) => {
    console.error('Error no capturado:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada:', e.reason);
});