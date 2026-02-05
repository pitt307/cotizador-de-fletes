const QuoteUI = {
    lastQuote: null,
    init() {
        this.setupFormHandler();
        this.renderHistory();
        this.renderFavorites();
    },
    setupFormHandler() {
        const form = document.getElementById('quote-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCalculate();
            });
        }
    },
    handleCalculate() {
        try {
            const data = {
                weight: document.getElementById('weight').value,
                length: document.getElementById('length').value,
                width: document.getElementById('width').value,
                height: document.getElementById('height').value,
                rate: document.getElementById('rate').value
            };
            if (!data.weight || parseFloat(data.weight) <= 0) {
                Utils.showNotification('Ingresa un peso válido', 'warning');
                return;
            }
            const quote = QuoteManager.calculate(data);
            this.lastQuote = quote;
            this.displayResult(quote);
            this.renderHistory();
        } catch (error) {
            console.error('Error al calcular:', error);
            Utils.showNotification(error.message, 'error');
        }
    },
    displayResult(quote) {
        const result = quote.result;
        const currency = CurrencyManager.getSymbol();
        document.getElementById('res-physical').textContent = 
            `${Utils.formatNumber(result.physicalWeight)} kg`;
            
        document.getElementById('res-volumetric').textContent = 
            `${Utils.formatNumber(result.volumetricWeight)} kg`;
            
        document.getElementById('res-factor').textContent = 
            result.factor.toLocaleString();
            
        document.getElementById('res-chargeable').textContent = 
            `${Utils.formatNumber(result.chargeableWeight)} kg`;
        const typeEl = document.getElementById('res-type');
        if (result.isVolumetric) {
            typeEl.textContent = 'Peso Volumétrico';
            typeEl.className = 'badge badge-volumetric';
        } else {
            typeEl.textContent = 'Peso Físico';
            typeEl.className = 'badge badge-physical';
        }
        document.getElementById('res-price').textContent = 
            CurrencyManager.format(result.totalCost);
        const resultSection = document.getElementById('result');
        resultSection.classList.add('active');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    saveToFavorites() {
        if (this.lastQuote) {
            QuoteManager.addToFavorites(this.lastQuote);
            this.renderFavorites();
        } else {
            Utils.showNotification('Primero calcula una cotización', 'warning');
        }
    },
    clearForm() {
        document.getElementById('quote-form').reset();
        document.getElementById('result').classList.remove('active');
        this.lastQuote = null;
        Utils.showNotification('Formulario limpiado', 'info');
    },
    renderHistory() {
        const container = document.getElementById('history-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (QuoteManager.history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No hay cotizaciones recientes</p>
                </div>
            `;
            return;
        }
        QuoteManager.history.forEach(quote => {
            const item = this.createQuoteItem(quote, 'history');
            container.appendChild(item);
        });
    },
    renderFavorites() {
        const container = document.getElementById('favorites-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (QuoteManager.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <p>No hay favoritos guardados</p>
                </div>
            `;
            return;
        }
        
        QuoteManager.favorites.forEach(quote => {
            const item = this.createQuoteItem(quote, 'favorite');
            container.appendChild(item);
        });
    },
    createQuoteItem(quote, type) {
        const item = document.createElement('div');
        item.className = 'quote-item';
        
        const date = new Date(quote.timestamp);
        const weight = quote.result.chargeableWeight;
        const price = CurrencyManager.format(quote.result.totalCost);
        const dims = quote.data.dimensions;
        
        item.innerHTML = `
            <div class="quote-item-header">
                <span class="quote-item-weight">${Utils.formatNumber(weight)} kg</span>
                <span class="quote-item-price">${price}</span>
            </div>
            <div class="quote-item-details">
                <span><i class="fas fa-calendar"></i> ${Utils.formatDate(date)}</span>
                <span><i class="fas fa-cube"></i> ${dims.length}×${dims.width}×${dims.height} cm</span>
            </div>
            <div class="quote-item-actions">
                <button class="btn-small" onclick="QuoteManager.loadQuote(${JSON.stringify(quote).replace(/"/g, '&quot;')})">
                    <i class="fas fa-redo"></i> Cargar
                </button>
                ${type === 'favorite' ? `
                    <button class="btn-small btn-delete" onclick="QuoteUI.removeFavorite('${quote.id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                ` : ''}
            </div>
        `;
        
        return item;
    },
    removeFavorite(id) {
        QuoteManager.removeFromFavorites(id);
        this.renderFavorites();
    }
};
window.QuoteUI = QuoteUI;
window.QuoteManager = QuoteManager;