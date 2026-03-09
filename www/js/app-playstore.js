// js/app-playstore.js - VERSIÓN PLAY STORE (CON LICENCIAS)

// ========== DETECCIÓN DE ENTORNO ==========
(function() {
    // Marcar como versión Play Store
    window.__IS_PLAYSTORE__ = true;
    console.log('📱 Versión Play Store iniciada');
})();

// ========== FUNCIONES DE NAVEGACIÓN CON LICENCIA ==========
function navigateTo(path) {
    // Verificar que licenseManager existe
    if (typeof licenseManager === 'undefined' || !licenseManager) {
        console.error('❌ licenseManager no disponible');
        alert('Error: Sistema de licencias no disponible');
        return;
    }
    
    const status = licenseManager.getLicenseStatus();
    
    if (status.isPremium || status.daysRemaining > 0) {
        console.log('✅ Acceso permitido a:', path);
        window.location.href = path;
    } else {
        console.log('⛔ Acceso denegado - prueba terminada');
        showLicenseModal();
        alert('Tu período de prueba ha terminado. Por favor, adquiere la licencia para continuar.');
    }
}

// ========== FUNCIONES DEL MODAL ==========
function showLicenseModal() {
    const modal = document.getElementById('licenseModal');
    if (!modal) {
        console.error('Modal no encontrado');
        return;
    }
    
    if (typeof licenseManager === 'undefined') {
        console.error('licenseManager no disponible');
        return;
    }
    
    const status = licenseManager.getLicenseStatus();
    const message = status.daysRemaining > 0 
        ? `Te quedan ${status.daysRemaining} días de prueba gratuita.` 
        : 'Tu período de prueba ha terminado.';
    
    const messageEl = document.getElementById('licenseMessage');
    const daysEl = document.getElementById('daysRemaining');
    const progressEl = document.getElementById('trialProgress');
    
    if (messageEl) messageEl.textContent = message;
    if (daysEl) daysEl.textContent = status.daysRemaining;
    
    if (progressEl) {
        const progress = ((15 - status.daysRemaining) / 15) * 100;
        progressEl.style.width = `${progress}%`;
    }
    
    modal.style.display = 'block';
}

function updateLicenseUI() {
    if (typeof licenseManager === 'undefined') return;
    
    const status = licenseManager.getLicenseStatus();
    const statusEl = document.getElementById('statusText');
    const badgeEl = document.getElementById('licenseStatus');
    const warningEl = document.getElementById('licenseWarning');
    
    if (!statusEl || !badgeEl) return;
    
    if (status.isPremium) {
        statusEl.textContent = 'Premium';
        badgeEl.className = 'text-sm px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto';
        badgeEl.innerHTML = '<i class="fas fa-crown mr-1"></i>Premium';
        if (warningEl) warningEl.classList.add('hidden');
    } else {
        statusEl.textContent = `${status.daysRemaining} días de prueba`;
        badgeEl.className = 'text-sm px-3 py-1 rounded-full bg-blue-800 mx-auto';
        badgeEl.innerHTML = `<i class="fas fa-clock text-yellow-400 mr-1"></i>Prueba: ${status.daysRemaining} días`;
        
        // Mostrar advertencia si quedan 5 días o menos
        if (status.daysRemaining <= 5 && status.daysRemaining > 0) {
            if (warningEl) warningEl.classList.remove('hidden');
        } else {
            if (warningEl) warningEl.classList.add('hidden');
        }
    }
}

function purchaseLicense() {
    if (confirm('¿Deseas comprar GymApp Premium por 3€?\n\nSe abrirá Google Play Store para completar la compra.')) {
        alert('Redirigiendo a Google Play Store...');
        
        // AQUÍ IRÁ LA INTEGRACIÓN REAL CON GOOGLE PLAY BILLING
        // Por ahora es una simulación
        
        setTimeout(() => {
            if (confirm('¿Compra completada? Presiona OK si el pago fue exitoso.')) {
                // Generar clave simulada
                const fakeKey = 'GYM-' + 
                    Math.random().toString(36).toUpperCase().substr(2, 4) + '-' +
                    Math.random().toString(36).toUpperCase().substr(2, 4) + '-' +
                    Math.random().toString(36).toUpperCase().substr(2, 4);
                
                if (typeof licenseManager !== 'undefined') {
                    licenseManager.activatePremium(fakeKey);
                    document.getElementById('licenseModal').style.display = 'none';
                    updateLicenseUI();
                    alert('¡Gracias por tu compra! GymApp Premium activado.');
                }
            }
        }, 2000);
    }
}

function enterLicenseKey() {
    const key = prompt('Introduce tu código de licencia:\nFormato: GYM-XXXX-XXXX-XXXX');
    
    if (typeof licenseManager === 'undefined') {
        alert('Error: Sistema de licencias no disponible');
        return;
    }
    
    if (key && licenseManager.validateLicenseKey(key)) {
        licenseManager.activatePremium(key.toUpperCase());
        document.getElementById('licenseModal').style.display = 'none';
        updateLicenseUI();
        alert('✅ Licencia activada correctamente. ¡Gracias!');
    } else if (key) {
        alert('❌ Código inválido. Por favor verifica el formato.\n\nFormato: GYM-XXXX-XXXX-XXXX');
    }
}

function closeLicenseModal() {
    const modal = document.getElementById('licenseModal');
    if (modal) modal.style.display = 'none';
}

// ========== FUNCIONES COMUNES ==========
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES');
}

function showNotification(message, type = 'info') {
    console.log(`${type}: ${message}`);
    // Para versión Play Store, podrías implementar notificaciones nativas
    if (window.Capacitor) {
        // Aquí irían notificaciones nativas de Android
    }
}

// ========== FUNCIONES DE UTILIDAD ==========
function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('Error leyendo localStorage:', e);
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error guardando en localStorage:', e);
        return false;
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ app-playstore.js cargado correctamente');
    
    // Esperar a que licenseManager esté disponible
    const checkLicenseManager = setInterval(() => {
        if (typeof licenseManager !== 'undefined') {
            clearInterval(checkLicenseManager);
            initializeApp();
        }
    }, 100);
    
    // Timeout por si algo sale mal
    setTimeout(() => {
        clearInterval(checkLicenseManager);
        if (typeof licenseManager === 'undefined') {
            console.error('❌ licenseManager no cargado después de 5 segundos');
        }
    }, 5000);
});

async function initializeApp() {
    console.log('Inicializando app Play Store...');
    
    // Actualizar fecha
    const today = new Date().toLocaleDateString('es-ES');
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) lastUpdateEl.textContent = today;
    
    // Actualizar versión
    const versionEl = document.getElementById('appVersion');
    if (versionEl) versionEl.textContent = 'v1.1';
    
    // Inicializar licencias
    await licenseManager.init();
    updateLicenseUI();
    
    // Configurar eventos del modal
    const buyBtn = document.getElementById('buyLicenseBtn');
    const enterBtn = document.getElementById('enterLicenseBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    
    if (buyBtn) buyBtn.addEventListener('click', purchaseLicense);
    if (enterBtn) enterBtn.addEventListener('click', enterLicenseKey);
    if (closeBtn) closeBtn.addEventListener('click', closeLicenseModal);
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('licenseModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Mostrar modal si es necesario (después de 2 segundos)
    setTimeout(() => {
        if (licenseManager.shouldShowModal()) {
            showLicenseModal();
        }
    }, 2000);
    
    // Detectar si estamos en Capacitor
    if (window.Capacitor) {
        console.log('📱 Ejecutando en entorno Capacitor/Android');
        document.body.classList.add('capacitor-mode');
    }
}