// storageManager.js
class StorageManager {
    constructor() {
        this.PREFIX = 'gymapp_v2_'; // Nueva versión para separar datos
        this.KEYS = {
            // MANUAL TRAINING
            MANUAL_WORKOUTS: `${this.PREFIX}manual_workouts`,
            MANUAL_EXERCISES: `${this.PREFIX}manual_exercises`,
            MANUAL_HISTORY: `${this.PREFIX}manual_history`,
            
            // SUPERSET TRAINING
            SUPERSET_WORKOUTS: `${this.PREFIX}superset_workouts`,
            SUPERSET_EXERCISES: `${this.PREFIX}superset_exercises`,
            SUPERSET_HISTORY: `${this.PREFIX}superset_history`,
            
            // COMPARTIDOS (pero separados por tipo)
            EXERCISE_LIBRARY: `${this.PREFIX}exercise_library`,
            USER_CONFIG: `${this.PREFIX}user_config`,
            APP_STATE: `${this.PREFIX}app_state`
        };
        
        this.init();
    }
    
    init() {
        console.log('StorageManager inicializado');
        this.migrateOldData();
    }
    
    // ========== MIGRACIÓN DE DATOS ANTIGUOS ==========
    migrateOldData() {
        const oldKeys = [
            'workouts', 'gymApp_workouts', 'exercises', 'gymApp_exercises',
            'exerciseHistory', 'workoutHistory', 'gymApp_history'
        ];
        
        oldKeys.forEach(oldKey => {
            const oldData = localStorage.getItem(oldKey);
            if (oldData) {
                try {
                    const data = JSON.parse(oldData);
                    
                    // Determinar si son datos manuales o superseries
                    if (Array.isArray(data)) {
                        data.forEach(item => {
                            if (this.isSupersetData(item)) {
                                this.saveSupersetData(item, oldKey);
                            } else {
                                this.saveManualData(item, oldKey);
                            }
                        });
                    }
                    
                    // Mantener datos antiguos por seguridad (comentar después)
                    // localStorage.removeItem(oldKey);
                    console.log(`Migrados datos de ${oldKey}`);
                    
                } catch (e) {
                    console.error(`Error migrando ${oldKey}:`, e);
                }
            }
        });
    }
    
    isSupersetData(item) {
        return (
            item.type === 'superset' ||
            item.mode === 'superset' ||
            item.supersets !== undefined ||
            (item.exercises && Array.isArray(item.exercises) && 
             item.exercises.some(ex => ex.type === 'superset' || ex.supersetGroup))
        );
    }
    
    saveManualData(item, source) {
        const workouts = this.getManualWorkouts();
        const newItem = {
            ...item,
            type: 'manual',
            mode: item.mode || 'manual',
            source: source,
            migratedAt: new Date().toISOString()
        };
        workouts.push(newItem);
        localStorage.setItem(this.KEYS.MANUAL_WORKOUTS, JSON.stringify(workouts));
    }
    
    saveSupersetData(item, source) {
        const workouts = this.getSupersetWorkouts();
        const newItem = {
            ...item,
            type: 'superset',
            mode: 'superset',
            source: source,
            migratedAt: new Date().toISOString()
        };
        workouts.push(newItem);
        localStorage.setItem(this.KEYS.SUPERSET_WORKOUTS, JSON.stringify(workouts));
    }
    
    // ========== MÉTODOS PARA MANUAL ==========
    saveManualWorkout(workout) {
        const workouts = this.getManualWorkouts();
        const newWorkout = {
            ...workout,
            id: Date.now(),
            type: 'manual',
            mode: workout.mode || 'manual',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        workouts.push(newWorkout);
        localStorage.setItem(this.KEYS.MANUAL_WORKOUTS, JSON.stringify(workouts));
        return newWorkout;
    }
    
    getManualWorkouts() {
        return JSON.parse(localStorage.getItem(this.KEYS.MANUAL_WORKOUTS)) || [];
    }
    
    updateManualWorkout(id, updates) {
        const workouts = this.getManualWorkouts();
        const index = workouts.findIndex(w => w.id === id);
        if (index !== -1) {
            workouts[index] = {
                ...workouts[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.MANUAL_WORKOUTS, JSON.stringify(workouts));
            return workouts[index];
        }
        return null;
    }
    
    deleteManualWorkout(id) {
        const workouts = this.getManualWorkouts();
        const filtered = workouts.filter(w => w.id !== id);
        localStorage.setItem(this.KEYS.MANUAL_WORKOUTS, JSON.stringify(filtered));
    }
    
    // ========== MÉTODOS PARA SUPERSERIES ==========
    saveSupersetWorkout(workout) {
        const workouts = this.getSupersetWorkouts();
        const newWorkout = {
            ...workout,
            id: Date.now() + 1000000, // IDs diferentes para evitar conflictos
            type: 'superset',
            mode: 'superset',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        workouts.push(newWorkout);
        localStorage.setItem(this.KEYS.SUPERSET_WORKOUTS, JSON.stringify(workouts));
        return newWorkout;
    }
    
    getSupersetWorkouts() {
        return JSON.parse(localStorage.getItem(this.KEYS.SUPERSET_WORKOUTS)) || [];
    }
    
    updateSupersetWorkout(id, updates) {
        const workouts = this.getSupersetWorkouts();
        const index = workouts.findIndex(w => w.id === id);
        if (index !== -1) {
            workouts[index] = {
                ...workouts[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.SUPERSET_WORKOUTS, JSON.stringify(workouts));
            return workouts[index];
        }
        return null;
    }
    
    deleteSupersetWorkout(id) {
        const workouts = this.getSupersetWorkouts();
        const filtered = workouts.filter(w => w.id !== id);
        localStorage.setItem(this.KEYS.SUPERSET_WORKOUTS, JSON.stringify(filtered));
    }
    
    // ========== EJERCICIOS SEPARADOS ==========
    saveManualExercise(exercise) {
        const exercises = this.getManualExercises();
        const newExercise = {
            ...exercise,
            id: Date.now(),
            type: 'manual',
            category: exercise.category || 'General'
        };
        exercises.push(newExercise);
        localStorage.setItem(this.KEYS.MANUAL_EXERCISES, JSON.stringify(exercises));
        return newExercise;
    }
    
    getManualExercises() {
        return JSON.parse(localStorage.getItem(this.KEYS.MANUAL_EXERCISES)) || [];
    }
    
    saveSupersetExercise(exercise) {
        const exercises = this.getSupersetExercises();
        const newExercise = {
            ...exercise,
            id: Date.now() + 2000000, // IDs diferentes
            type: 'superset',
            category: exercise.category || 'Superserie'
        };
        exercises.push(newExercise);
        localStorage.setItem(this.KEYS.SUPERSET_EXERCISES, JSON.stringify(exercises));
        return newExercise;
    }
    
    getSupersetExercises() {
        return JSON.parse(localStorage.getItem(this.KEYS.SUPERSET_EXERCISES)) || [];
    }
    
    // ========== MÉTODOS DE VERIFICACIÓN ==========
    checkDataSeparation() {
        console.log('=== VERIFICANDO SEPARACIÓN DE DATOS ===');
        
        const manualWorkouts = this.getManualWorkouts();
        const supersetWorkouts = this.getSupersetWorkouts();
        
        const manualInSuperset = supersetWorkouts.filter(w => w.type === 'manual');
        const supersetInManual = manualWorkouts.filter(w => w.type === 'superset');
        
        if (manualInSuperset.length > 0 || supersetInManual.length > 0) {
            console.warn('⚠️  Datos mezclados encontrados:', {
                manualEnSuperset: manualInSuperset.length,
                supersetEnManual: supersetInManual.length
            });
            return false;
        }
        
        console.log('✅ Datos correctamente separados');
        return true;
    }
    
    fixMixedData() {
        console.log('=== CORRIGIENDO DATOS MEZCLADOS ===');
        
        let fixed = 0;
        
        // Revisar superseries que sean manuales
        const supersetWorkouts = this.getSupersetWorkouts();
        const manualInSuperset = supersetWorkouts.filter(w => w.type === 'manual');
        
        manualInSuperset.forEach(workout => {
            this.saveManualWorkout(workout);
            this.deleteSupersetWorkout(workout.id);
            fixed++;
        });
        
        // Revisar manuales que sean superseries
        const manualWorkouts = this.getManualWorkouts();
        const supersetInManual = manualWorkouts.filter(w => w.type === 'superset');
        
        supersetInManual.forEach(workout => {
            this.saveSupersetWorkout(workout);
            this.deleteManualWorkout(workout.id);
            fixed++;
        });
        
        console.log(`✅ Corregidos ${fixed} registros mezclados`);
        return fixed;
    }
    
    // ========== BACKUP Y RESTAURACIÓN ==========
    exportData(type = 'all') {
        const data = {};
        
        if (type === 'all' || type === 'manual') {
            data.manualWorkouts = this.getManualWorkouts();
            data.manualExercises = this.getManualExercises();
        }
        
        if (type === 'all' || type === 'superset') {
            data.supersetWorkouts = this.getSupersetWorkouts();
            data.supersetExercises = this.getSupersetExercises();
        }
        
        return {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            type: type,
            data: data
        };
    }
    
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.data.manualWorkouts) {
                localStorage.setItem(this.KEYS.MANUAL_WORKOUTS, 
                    JSON.stringify(data.data.manualWorkouts));
            }
            
            if (data.data.supersetWorkouts) {
                localStorage.setItem(this.KEYS.SUPERSET_WORKOUTS, 
                    JSON.stringify(data.data.supersetWorkouts));
            }
            
            console.log('✅ Datos importados correctamente');
            return true;
        } catch (e) {
            console.error('Error importando datos:', e);
            return false;
        }
    }
}

// Crear instancia global
const storageManager = new StorageManager();