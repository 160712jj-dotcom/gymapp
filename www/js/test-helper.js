// js/test-helper.js - AYUDA PARA PRUEBAS (solo para desarrollo)

(function() {
    console.log('🧪 MODO PRUEBA ACTIVADO - Helper cargado');
    
    // Solo activar en entorno de prueba (no en producción)
    const isTestMode = true; // Cambiar a false cuando subas a Play Store
    
    if (!isTestMode) return;
    
    // Crear panel flotante de pruebas
    function createTestPanel() {
        const panel = document.createElement('div');
        panel.id = 'test-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a202c;
            border: 3px solid #fbbf24;
            border-radius: 15px;
            padding: 15px;
            z-index: 10000;
            width: 250px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        panel.innerHTML = `
            <div style="text-align:center; margin-bottom:15px; border-bottom:1px solid #fbbf24; padding-bottom:10px;">
                <span style="background:#fbbf24; color:#1a202c; padding:5px 10px; border-radius:20px; font-weight:bold;">
                    🧪 MODO PRUEBA
                </span>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:12px; color:#9ca3af; margin-bottom:5px;">📅 Simular tiempo:</div>
                <button onclick="testHelper.simulateDays(1)" style="background:#3b82f6; color:white; border:none; padding:8px; margin:2px; border-radius:5px; width:30%;">Día 1</button>
                <button onclick="testHelper.simulateDays(10)" style="background:#3b82f6; color:white; border:none; padding:8px; margin:2px; border-radius:5px; width:30%;">Día 10</button>
                <button onclick="testHelper.simulateDays(16)" style="background:#ef4444; color:white; border:none; padding:8px; margin:2px; border-radius:5px; width:30%;">Día 16</button>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:12px; color:#9ca3af; margin-bottom:5px;">💰 Simular compra:</div>
                <button onclick="testHelper.simulatePurchase('success')" style="background:#10b981; color:white; border:none; padding:8px; margin:2px; border-radius:5px; width:48%;">✅ Exitosa</button>
                <button onclick="testHelper.simulatePurchase('cancel')" style="background:#f59e0b; color:white; border:none; padding:8px; margin:2px; border-radius:5px; width:48%;">❌ Cancelada</button>
            </div>
            
            <div style="margin-bottom:15px;">
                <button onclick="testHelper.resetTrial()" style="background:#8b5cf6; color:white; border:none; padding:8px; border-radius:5px; width:100%;">
                    🔄 Reiniciar prueba (día 1)
                </button>
            </div>
            
            <div style="margin-bottom:15px;">
                <button onclick="testHelper.activatePremium()" style="background:#fbbf24; color:#1a202c; border:none; padding:8px; border-radius:5px; width:100%; font-weight:bold;">
                    👑 ACTIVAR PREMIUM YA
                </button>
            </div>
            
            <div style="font-size:10px; color:#6b7280; text-align:center; margin-top:10px;">
                ⚡ Panel visible solo en pruebas
                <br>
                <button onclick="this.parentElement.parentElement.remove()" style="background:transparent; color:#9ca3af; border:none; text-decoration:underline; margin-top:5px;">Ocultar panel</button>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    // Funciones de prueba globales
    window.testHelper = {
        simulateDays: function(days) {
            const installDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            localStorage.setItem('gymapp_install_date', installDate.toISOString());
            localStorage.removeItem('gymapp_is_premium');
            alert(`⏰ Simulado: Han pasado ${days} días desde la instalación`);
            location.reload();
        },
        
        simulatePurchase: function(result) {
            if (result === 'success') {
                // Generar clave simulada
                const fakeKey = 'GYM-TEST-' + 
                    Math.random().toString(36).toUpperCase().substr(2, 4) + '-' +
                    Math.random().toString(36).toUpperCase().substr(2, 4) + '-' +
                    Math.random().toString(36).toUpperCase().substr(2, 4);
                
                if (window.licenseManager) {
                    licenseManager.activatePremium(fakeKey);
                    alert('✅ [PRUEBA] Compra simulada exitosa. Premium activado.');
                    location.reload();
                }
            } else {
                alert('❌ [PRUEBA] Compra cancelada (simulación)');
            }
        },
        
        resetTrial: function() {
            localStorage.removeItem('gymapp_install_date');
            localStorage.removeItem('gymapp_is_premium');
            localStorage.removeItem('gymapp_license_key');
            alert('🔄 Prueba reiniciada - Vuelves a tener 15 días');
            location.reload();
        },
        
        activatePremium: function() {
            const fakeKey = 'GYM-PREMIUM-' + Date.now().toString().slice(-8);
            if (window.licenseManager) {
                licenseManager.activatePremium(fakeKey);
                alert('👑 Modo premium activado manualmente');
                location.reload();
            }
        },
        
        getStatus: function() {
            if (!window.licenseManager) return;
            const status = licenseManager.getLicenseStatus();
            console.log('📊 Estado actual:', status);
            alert(`Estado:
Premium: ${status.isPremium ? '✅' : '❌'}
Días restantes: ${status.daysRemaining}
Días totales: ${status.trialDays}`);
        }
    };
    
    // Crear panel después de 1 segundo
    setTimeout(createTestPanel, 1000);
})();