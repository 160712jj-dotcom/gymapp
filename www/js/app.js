// js/app.js - VERSIÓN WEB (GRATUITA)

// ========== PROTECCIÓN CONTRA LICENCIAS ==========
(function() {
    // Marcar como versión web
    window.__IS_WEB_VERSION__ = true;
    
    // Bloquear cualquier intento de cargar licenseManager.js
    const originalAppendChild = document.head.appendChild;
    document.head.appendChild = function(element) {
        if (element.src && element.src.includes('licenseManager.js')) {
            console.log('ℹ️ Archivo de licencias ignorado (versión web)');
            return element;
        }
        return originalAppendChild.call(this, element);
    };
    
    // Prevenir creación de licenseManager
    Object.defineProperty(window, 'licenseManager', {
        get: function() { 
            return null;
        },
        set: function() { },
        configurable: false
    });
    
    console.log('✅ Versión web gratuita iniciada');
})();

// ========== FUNCIONES DE NAVEGACIÓN ==========
function navigateTo(path) {
    // Versión web: acceso libre y gratuito
    console.log('Navegando a:', path);
    window.location.href = path;
}

// ========== FUNCIONES COMUNES ==========
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES');
}

function showNotification(message, type = 'info') {
    console.log(`${type}: ${message}`);
    // Aquí puedes implementar toast o alert según necesites
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ app.js cargado correctamente');
    
    // Actualizar fecha si existe el elemento
    const today = new Date().toLocaleDateString('es-ES');
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = today;
    }
    
    // Actualizar versión
    const versionEl = document.getElementById('appVersion');
    if (versionEl) {
        versionEl.textContent = 'v1.1';
    }
});