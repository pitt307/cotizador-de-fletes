const QuoteManager = {
    VOLUMETRIC_FACTOR: 5000,
    history: [],
    favorites: [],
    HISTORY_KEY: 'cotizador_history',
    FAVORITES_KEY: 'cotizador_favorites',
    init() {
        this.loadHistory();
        this.loadFavorites();
    },
    calculate(data) {
        const { weight, length, width, height, rate } = data;
        if (!Utils.isValidNumber(weight) || !Utils.isValidNumber(rate)) {
            throw new Error('Peso y tarifa deben ser números válidos');
        }
        const physicalWeight = parseFloat(weight);
        let volumetricWeight = 0;
        if (length && width && height) {
            volumetricWeight = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / this.VOLUMETRIC_FACTOR;
        }
        const chargeableWeight = Math.max(physicalWeight, volumetricWeight);
        const isVolumetric = volumetricWeight > physicalWeight;
        const rateValue = parseFloat(rate);
        const totalCost = chargeableWeight * rateValue;
        const quote = {
            id: Utils.generateId(),
            timestamp: new Date().toISOString(),
            data: {
                weight: physicalWeight,
                dimensions: {
                    length: parseFloat(length) || 0,
                    width: parseFloat(width) || 0,
                    height: parseFloat(height) || 0
                },
                rate: rateValue,
                currency: CurrencyManager.currentCurrency
            },
            result: {
                physicalWeight,
                volumetricWeight,
                chargeableWeight,
                isVolumetric,
                type: isVolumetric ? 'volumetric' : 'physical',
                totalCost,
                factor: this.VOLUMETRIC_FACTOR
            }
        };
        this.addToHistory(quote);
        
        return quote;
    },
    addToHistory(quote) {
        this.history.unshift(quote);
        
        
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.saveHistory();
    },
    addToFavorites(quote) {
        const exists = this.favorites.find(f => f.id === quote.id);
        if (exists) {
            Utils.showNotification('Ya está en favoritos', 'info');
            return;
        }
        
        this.favorites.unshift(quote);
        this.saveFavorites();
        Utils.showNotification('Agregado a favoritos', 'success');
    },
    removeFromFavorites(id) {
        this.favorites = this.favorites.filter(f => f.id !== id);
        this.saveFavorites();
        Utils.showNotification('Eliminado de favoritos', 'success');
    },
    loadQuote(quote) {
        document.getElementById('weight').value = quote.data.weight;
        document.getElementById('length').value = quote.data.dimensions.length;
        document.getElementById('width').value = quote.data.dimensions.width;
        document.getElementById('height').value = quote.data.dimensions.height;
        document.getElementById('rate').value = quote.data.rate;
        if (quote.data.currency !== CurrencyManager.currentCurrency) {
            document.getElementById('currency').value = quote.data.currency;
            CurrencyManager.setCurrency(quote.data.currency);
        }
        QuoteUI.displayResult(quote);
        
        Utils.showNotification('Cotización cargada', 'success');
    },
    clearHistory() {
        if (confirm('¿Seguro que deseas limpiar todo el historial?')) {
            this.history = [];
            this.saveHistory();
            QuoteUI.renderHistory();
            Utils.showNotification('Historial limpiado', 'success');
        }
    },
    clearFavorites() {
        if (confirm('¿Seguro que deseas eliminar todos los favoritos?')) {
            this.favorites = [];
            this.saveFavorites();
            QuoteUI.renderFavorites();
            Utils.showNotification('Favoritos eliminados', 'success');
        }
    },
    saveHistory() {
        try {
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history));
        } catch (error) {
            console.error('Error al guardar historial:', error);
        }
    },
    loadHistory() {
        try {
            const data = localStorage.getItem(this.HISTORY_KEY);
            if (data) {
                this.history = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error al cargar historial:', error);
        }
    },
    saveFavorites() {
        try {
            localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error al guardar favoritos:', error);
        }
    },
    loadFavorites() {
        try {
            const data = localStorage.getItem(this.FAVORITES_KEY);
            if (data) {
                this.favorites = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    },
    exportHistory() {
        Utils.downloadJSON(this.history, 'historial-cotizaciones.json');
    },
    exportFavorites() {
        Utils.downloadJSON(this.favorites, 'favoritos-cotizaciones.json');
    }
};