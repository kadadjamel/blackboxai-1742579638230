// Default rates data structure
const defaultRates = {
    traditional: {
        USD: { rate: 3.75, lastUpdated: new Date().toISOString() },
        EUR: { rate: 4.45, lastUpdated: new Date().toISOString() },
        GBP: { rate: 5.20, lastUpdated: new Date().toISOString() },
        SAR: { rate: 1.00, lastUpdated: new Date().toISOString() }
    },
    crypto: {
        USDT: { rate: 3.74, lastUpdated: new Date().toISOString() },
        Bitcoin: { rate: 150000.00, lastUpdated: new Date().toISOString() },
        KADADZ: { rate: 2.50, lastUpdated: new Date().toISOString() }
    }
};

// Admin password
const ADMIN_PASSWORD = 'Saida@2020';

// Initialize rates data from localStorage or use defaults
let ratesData = JSON.parse(localStorage.getItem('ratesData')) || defaultRates;

// Current language
let currentLang = localStorage.getItem('language') || 'ar';

// Format date for display based on language
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-US', options);
}

// Format number (always using Latin digits)
function formatNumber(number) {
    return number.toFixed(2);
}

// Update language buttons active state
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Change language function
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML dir attribute and language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[lang][key];
    });

    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translations[lang][key];
    });

    // Update language buttons
    updateLanguageButtons();

    // Re-render rates to update currency names and alignment
    renderRates();
    
    // If admin form is open, re-render it
    if (!document.getElementById('updateSection').classList.contains('hidden')) {
        renderAdminForm();
    }
}

// Render rates tables
function renderRates() {
    const textAlignClass = currentLang === 'ar' ? 'text-right' : 'text-left';
    const flexDirectionClass = currentLang === 'ar' ? 'flex-row-reverse' : 'flex-row';
    
    // Render traditional currencies
    const traditionalBody = document.getElementById('traditionalRatesBody');
    traditionalBody.innerHTML = Object.entries(ratesData.traditional)
        .map(([currency, data]) => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap ${textAlignClass} currency-cell">
                    <div class="flex items-center ${currentLang === 'ar' ? 'justify-end' : 'justify-start'} ${flexDirectionClass}">
                        <div class="text-sm font-medium text-gray-900">${translations[currentLang].currencies[currency]}</div>
                        <div class="text-sm text-gray-500 mx-2">(${currency})</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap ${textAlignClass} price-cell">
                    <div class="text-sm text-gray-900">${formatNumber(data.rate)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${textAlignClass} update-cell">
                    ${formatDate(data.lastUpdated)}
                </td>
            </tr>
        `).join('');

    // Render cryptocurrency rates
    const cryptoBody = document.getElementById('cryptoRatesBody');
    cryptoBody.innerHTML = Object.entries(ratesData.crypto)
        .map(([currency, data]) => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap ${textAlignClass} currency-cell">
                    <div class="flex items-center ${currentLang === 'ar' ? 'justify-end' : 'justify-start'} ${flexDirectionClass}">
                        <div class="text-sm font-medium text-gray-900">${translations[currentLang].currencies[currency]}</div>
                        <div class="text-sm text-gray-500 mx-2">(${currency})</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap ${textAlignClass} price-cell">
                    <div class="text-sm text-gray-900">${formatNumber(data.rate)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${textAlignClass} update-cell">
                    ${formatDate(data.lastUpdated)}
                </td>
            </tr>
        `).join('');
}

// Render admin form inputs
function renderAdminForm() {
    const textAlignClass = currentLang === 'ar' ? 'text-right' : 'text-left';
    
    // Render traditional currency inputs
    const traditionalInputs = document.getElementById('traditionalInputs');
    traditionalInputs.innerHTML = Object.entries(ratesData.traditional)
        .map(([currency, data]) => `
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 ${textAlignClass}" for="${currency}-rate">
                    ${translations[currentLang].currencies[currency]} (${currency})
                </label>
                <input type="number" step="0.01" id="${currency}-rate" value="${data.rate}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${textAlignClass}">
            </div>
        `).join('');

    // Render cryptocurrency inputs
    const cryptoInputs = document.getElementById('cryptoInputs');
    cryptoInputs.innerHTML = Object.entries(ratesData.crypto)
        .map(([currency, data]) => `
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 ${textAlignClass}" for="${currency}-rate">
                    ${translations[currentLang].currencies[currency]} (${currency})
                </label>
                <input type="number" step="0.01" id="${currency}-rate" value="${data.rate}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${textAlignClass}">
            </div>
        `).join('');
}

// Show admin login modal
function showAdminLogin() {
    const modal = document.getElementById('adminModal');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    loginSection.classList.remove('hidden');
    updateSection.classList.add('hidden');
    
    document.getElementById('adminPassword').value = '';
}

// Hide admin modal
function hideAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Validate admin password
function validateAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('updateSection').classList.remove('hidden');
        renderAdminForm();
    } else {
        alert(translations[currentLang].invalidPassword);
    }
}

// Save updated rates
function saveRates() {
    try {
        // Update traditional currencies
        Object.keys(ratesData.traditional).forEach(currency => {
            const input = document.getElementById(`${currency}-rate`);
            const newRate = parseFloat(input.value);
            
            if (isNaN(newRate) || newRate <= 0) {
                throw new Error(`Invalid value for ${translations[currentLang].currencies[currency]}`);
            }
            
            ratesData.traditional[currency] = {
                rate: newRate,
                lastUpdated: new Date().toISOString()
            };
        });

        // Update cryptocurrencies
        Object.keys(ratesData.crypto).forEach(currency => {
            const input = document.getElementById(`${currency}-rate`);
            const newRate = parseFloat(input.value);
            
            if (isNaN(newRate) || newRate <= 0) {
                throw new Error(`Invalid value for ${translations[currentLang].currencies[currency]}`);
            }
            
            ratesData.crypto[currency] = {
                rate: newRate,
                lastUpdated: new Date().toISOString()
            };
        });

        // Save to localStorage
        localStorage.setItem('ratesData', JSON.stringify(ratesData));
        
        // Update display
        renderRates();
        hideAdminModal();
        
        // Show success message
        alert(translations[currentLang].updateSuccess);
    } catch (error) {
        alert(`${translations[currentLang].error || 'Error'}: ${error.message}`);
    }
}

// Initialize the display
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    const savedLang = localStorage.getItem('language') || 'ar';
    changeLanguage(savedLang);
});