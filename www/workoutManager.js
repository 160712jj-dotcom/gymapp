// workoutManager.js
class WorkoutManager {
    constructor() {
        this.storageKeys = {
            MANUAL_WORKOUTS: 'gymapp_manual_workouts',
            SUPERSET_WORKOUTS: 'gymapp_superset_workouts',
            EXERCISE_LIBRARY: 'gymapp_exercise_library'
        };
        
        this.initializeStorage();
    }
    
    initializeStorage() {
        // Inicializar cada almacenamiento si no existe
        if (!localStorage.getItem(this.storageKeys.MANUAL_WORKOUTS)) {
            localStorage.setItem(this.storageKeys.MANUAL_WORKOUTS, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(this.storageKeys.SUPERSET_WORKOUTS)) {
            localStorage.setItem(this.storageKeys.SUPERSET_WORKOUTS, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(this.storageKeys.EXERCISE_LIBRARY)) {
            // Ejercicios base compartidos (solo nombres, no rutinas)
            const defaultExercises = [
                { id: 1, name: "Press Banca", category: "Pecho", type: "manual" },
                { id: 2, name: "Sentadillas", category: "Piernas", type: "manual" },
                { id: 3, name: "Dominadas", category: "Espalda", type: "manual" },
                { id: 4, name: "Press Militar", category: "Hombros", type: "manual" },
                { id: 5, name: "Curl Bíceps", category: "Brazos", type: "manual" },
                { id: 6, name: "Press Banca + Aperturas", category: "Superserie", type: "superset" },
                { id: 7, name: "Sentadilla + Zancadas", category: "Superserie", type: "superset" },
                { id: 8, name: "Jalón + Remo", category: "Superserie", type: "superset" }
            ];
            localStorage.setItem(this.storageKeys.EXERCISE_LIBRARY, JSON.stringify(defaultExercises));
        }
    }
    
    // ========== MÉTODOS PARA ENTRENAMIENTO MANUAL ==========
    saveManualWorkout(workout) {
        const workouts = this.getManualWorkouts();
        const newWorkout = {
            ...workout,
            id: Date.now(),
            type: 'manual',
            date: new Date().toISOString()
        };
        workouts.push(newWorkout);
        localStorage.setItem(this.storageKeys.MANUAL_WORKOUTS, JSON.stringify(workouts));
        return newWorkout;
    }
    
    getManualWorkouts() {
        return JSON.parse(localStorage.getItem(this.storageKeys.MANUAL_WORKOUTS)) || [];
    }
    
    deleteManualWorkout(id) {
        const workouts = this.getManualWorkouts();
        const filtered = workouts.filter(w => w.id !== id);
        localStorage.setItem(this.storageKeys.MANUAL_WORKOUTS, JSON.stringify(filtered));
    }
    
    // ========== MÉTODOS PARA SUPERSERIES ==========
    saveSupersetWorkout(workout) {
        const workouts = this.getSupersetWorkouts();
        const newWorkout = {
            ...workout,
            id: Date.now(),
            type: 'superset',
            date: new Date().toISOString()
        };
        workouts.push(newWorkout);
        localStorage.setItem(this.storageKeys.SUPERSET_WORKOUTS, JSON.stringify(workouts));
        return newWorkout;
    }
    
    getSupersetWorkouts() {
        return JSON.parse(localStorage.getItem(this.storageKeys.SUPERSET_WORKOUTS)) || [];
    }
    
    getSupersetExercises() {
        // Solo ejercicios de tipo superserie
        const allExercises = this.getExerciseLibrary();
        return allExercises.filter(ex => ex.type === 'superset');
    }
    
    deleteSupersetWorkout(id) {
        const workouts = this.getSupersetWorkouts();
        const filtered = workouts.filter(w => w.id !== id);
        localStorage.setItem(this.storageKeys.SUPERSET_WORKOUTS, JSON.stringify(filtered));
    }
    
    // ========== MÉTODOS COMPARTIDOS ==========
    getExerciseLibrary() {
        return JSON.parse(localStorage.getItem(this.storageKeys.EXERCISE_LIBRARY)) || [];
    }
    
    addExerciseToLibrary(exercise) {
        const exercises = this.getExerciseLibrary();
        const newExercise = {
            ...exercise,
            id: Date.now()
        };
        exercises.push(newExercise);
        localStorage.setItem(this.storageKeys.EXERCISE_LIBRARY, JSON.stringify(exercises));
        return newExercise;
    }
    
    // ========== MÉTODOS DE ESTADÍSTICAS ==========
    getStats() {
        const manual = this.getManualWorkouts();
        const supersets = this.getSupersetWorkouts();
        
        return {
            totalManual: manual.length,
            totalSupersets: supersets.length,
            totalWorkouts: manual.length + supersets.length,
            lastManual: manual.length > 0 ? manual[manual.length - 1].date : null,
            lastSuperset: supersets.length > 0 ? supersets[supersets.length - 1].date : null
        };
    }
    
    // ========== MIGRACIÓN DE DATOS EXISTENTES ==========
    migrateOldData() {
        // Si tienes datos antiguos en localStorage, migrarlos aquí
        const oldWorkouts = localStorage.getItem('workouts') || 
                           localStorage.getItem('gymapp_workouts');
        
        if (oldWorkouts) {
            try {
                const parsed = JSON.parse(oldWorkouts);
                // Asumir que son manuales
                parsed.forEach(workout => {
                    this.saveManualWorkout({
                        ...workout,
                        type: 'manual'
                    });
                });
                
                // Eliminar datos antiguos
                localStorage.removeItem('workouts');
                localStorage.removeItem('gymapp_workouts');
                console.log('Datos antiguos migrados correctamente');
            } catch (e) {
                console.error('Error migrando datos antiguos:', e);
            }
        }
    }
}

// Crear instancia global
const workoutManager = new WorkoutManager();