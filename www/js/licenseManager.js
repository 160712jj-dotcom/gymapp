// js/licenseManager.js
class LicenseManager {
    constructor() {
        this.STORAGE_KEYS = {
            INSTALL_DATE: 'gymapp_install_date',
            LICENSE_KEY: 'gymapp_license_key',
            IS_PREMIUM: 'gymapp_is_premium'
        };
        
        this.TRIAL_DAYS = 15;
        this.PRICE = 3.00;
    }
    
    async init() {
        console.log('LicenseManager inicializado');
        this.checkFirstInstall();
        this.verifyLicenseStatus();
        return this.getLicenseStatus();
    }
    
    checkFirstInstall() {
        const installDate = localStorage.getItem(this.STORAGE_KEYS.INSTALL_DATE);
        
        if (!installDate) {
            const now = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEYS.INSTALL_DATE, now);
            console.log('📅 Primera instalación registrada:', now);
        }
    }
    
    verifyLicenseStatus() {
        const licenseKey = localStorage.getItem(this.STORAGE_KEYS.LICENSE_KEY);
        const isPremium = localStorage.getItem(this.STORAGE_KEYS.IS_PREMIUM);
        
        if (licenseKey && this.validateLicenseKey(licenseKey)) {
            localStorage.setItem(this.STORAGE_KEYS.IS_PREMIUM, 'true');
            return true;
        }
        
        return isPremium === 'true';
    }
    
    getTrialDaysRemaining() {
        const installDateStr = localStorage.getItem(this.STORAGE_KEYS.INSTALL_DATE);
        if (!installDateStr) return this.TRIAL_DAYS;
        
        const installDate = new Date(installDateStr);
        const now = new Date();
        const diffTime = now - installDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, this.TRIAL_DAYS - diffDays);
    }
    
    isPremium() {
        return localStorage.getItem(this.STORAGE_KEYS.IS_PREMIUM) === 'true';
    }
    
    validateLicenseKey(key) {
        const pattern = /^GYM-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        return pattern.test(key);
    }
    
    activatePremium(licenseKey = null) {
        if (licenseKey) {
            localStorage.setItem(this.STORAGE_KEYS.LICENSE_KEY, licenseKey);
        }
        localStorage.setItem(this.STORAGE_KEYS.IS_PREMIUM, 'true');
        console.log('🎉 Licencia premium activada');
        return true;
    }
    
    getLicenseStatus() {
        return {
            isPremium: this.isPremium(),
            daysRemaining: this.getTrialDaysRemaining(),
            trialDays: this.TRIAL_DAYS,
            price: this.PRICE
        };
    }
    
    shouldShowModal() {
        if (this.isPremium()) return false;
        const days = this.getTrialDaysRemaining();
        return days <= 5;
    }
}

// Crear instancia global
const licenseManager = new LicenseManager();