const CurrencyManager = {
    currentCurrency: 'PEN',
    exchangeRates: {
        USD: 1.0,    
        PEN: 3.75,     
        EUR: 0.92     
    },
    init() {
        this.loadSavedCurrency();
        this.setupCurrencySelector();
    },
    loadSavedCurrency() {
        const saved = localStorage.getItem('cotizador_currency');
        if (saved && this.exchangeRates[saved]) {
            this.currentCurrency = saved;
        }
    },
    saveCurrency() {
        localStorage.setItem('cotizador_currency', this.currentCurrency);
    },
    setupCurrencySelector() {
        const selector = document.getElementById('currency');
        if (selector) {
            selector.value = this.currentCurrency;
            selector.addEventListener('change', (e) => {
                this.setCurrency(e.target.value);
            });
        }
    },
    setCurrency(currency) {
        if (this.exchangeRates[currency]) {
            this.currentCurrency = currency;
            this.saveCurrency();
            this.updateCurrencySymbols();
            if (QuoteUI && QuoteUI.lastQuote) {
                QuoteUI.displayResult(QuoteUI.lastQuote);
            }
        }
    },
    updateCurrencySymbols() {
        const symbols = {
            USD: '$',
            PEN: 'S/',
            EUR: '€'
        };
        
        const symbolElements = document.querySelectorAll('.currency-symbol');
        symbolElements.forEach(el => {
            el.textContent = symbols[this.currentCurrency];
        });
    },
    convertFromUSD(amountUSD) {
        return amountUSD * this.exchangeRates[this.currentCurrency];
    },
    convertToUSD(amount) {
        return amount / this.exchangeRates[this.currentCurrency];
    },
    getSymbol() {
        const symbols = {
            USD: '$',
            PEN: 'S/',
            EUR: '€'
        };
        return symbols[this.currentCurrency];
    },
    format(amount) {
        return Utils.formatCurrency(amount, this.currentCurrency);
    },
    getCurrentRate() {
        return this.exchangeRates[this.currentCurrency];
    },
    updateRates(rates) {
        this.exchangeRates = { ...this.exchangeRates, ...rates };
        localStorage.setItem('cotizador_rates', JSON.stringify(this.exchangeRates));
    }
};