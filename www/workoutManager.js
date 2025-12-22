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
    
    // En workoutManager.js - MODIFICAR la parte de exerciseLibrary
    initializeStorage() {
        // Inicializar cada almacenamiento si no existe
        
        // MANUAL WORKOUTS
        if (!localStorage.getItem(this.storageKeys.MANUAL_WORKOUTS)) {
            localStorage.setItem(this.storageKeys.MANUAL_WORKOUTS, JSON.stringify([]));
        }
        
        // SUPERSET WORKOUTS
        if (!localStorage.getItem(this.storageKeys.SUPERSET_WORKOUTS)) {
            localStorage.setItem(this.storageKeys.SUPERSET_WORKOUTS, JSON.stringify([]));
        }
        
        // EJERCICIOS BASE - AHORA SEPARADOS POR TIPO
        if (!localStorage.getItem(this.storageKeys.EXERCISE_LIBRARY)) {
            const defaultExercises = {
                // EJERCICIOS PARA ENTRENAMIENTO MANUAL
                manual: [
                    { id: 1, name: "Press Banca", category: "Pecho", type: "manual" },
                    { id: 2, name: "Sentadillas", category: "Piernas", type: "manual" },
                    { id: 3, name: "Dominadas", category: "Espalda", type: "manual" },
                    { id: 4, name: "Press Militar", category: "Hombros", type: "manual" },
                    { id: 5, name: "Curl Bíceps", category: "Brazos", type: "manual" },
                    { id: 6, name: "Press Francés", category: "Tríceps", type: "manual" },
                    { id: 7, name: "Peso Muerto", category: "Espalda", type: "manual" },
                    { id: 8, name: "Elevaciones Laterales", category: "Hombros", type: "manual" }
                ],
                
                // EJERCICIOS ESPECÍFICOS PARA SUPERSERIES
                superset: [
                    { id: 1001, name: "Press Banca + Aperturas", category: "Pecho", type: "superset" },
                    { id: 1002, name: "Sentadilla + Zancadas", category: "Piernas", type: "superset" },
                    { id: 1003, name: "Jalón al Pecho + Remo", category: "Espalda", type: "superset" },
                    { id: 1004, name: "Press Militar + Elevaciones", category: "Hombros", type: "superset" },
                    { id: 1005, name: "Curl Bíceps + Martillo", category: "Brazos", type: "superset" },
                    { id: 1006, name: "Fondos + Extensión Tríceps", category: "Tríceps", type: "superset" },
                    { id: 1007, name: "Prensa + Extensión de Cuádriceps", category: "Piernas", type: "superset" },
                    { id: 1008, name: "Remo + Face Pull", category: "Espalda/Hombros", type: "superset" }
                ],
                
                // SUPERSERIES PREDEFINIDAS (grupos de ejercicios)
                supersetGroups: [
                    { 
                        id: 2001, 
                        name: "Superserie Pecho Completo", 
                        type: "supersetGroup",
                        exercises: [
                            { name: "Press Banca", sets: 3, reps: "8-10" },
                            { name: "Aperturas", sets: 3, reps: "12-15" },
                            { name: "Fondos", sets: 3, reps: "10-12" }
                        ]
                    },
                    { 
                        id: 2002, 
                        name: "Superserie Pierna Intensa", 
                        type: "supersetGroup",
                        exercises: [
                            { name: "Sentadilla", sets: 4, reps: "6-8" },
                            { name: "Prensa", sets: 3, reps: "10-12" },
                            { name: "Extensiones", sets: 3, reps: "12-15" }
                        ]
                    }
                ]
            };
            
            localStorage.setItem(this.storageKeys.EXERCISE_LIBRARY, JSON.stringify(defaultExercises));
        }
    }

    // ========== MÉTODOS PARA OBTENER EJERCICIOS POR TIPO ==========

    // Obtener solo ejercicios manuales
    getManualExercises() {
        const library = this.getExerciseLibrary();
        return library.manual || [];
    }

    // Obtener solo ejercicios de superseries
    getSupersetExercises() {
        const library = this.getExerciseLibrary();
        return library.superset || [];
    }

    // Obtener superseries predefinidas
    getSupersetGroups() {
        const library = this.getExerciseLibrary();
        return library.supersetGroups || [];
    }

    // Obtener TODOS los ejercicios (incluyendo todos los tipos)
    getAllExercises() {
        const library = this.getExerciseLibrary();
        return {
            manual: library.manual || [],
            superset: library.superset || [],
            supersetGroups: library.supersetGroups || []
        };
    }

    // ========== MÉTODOS PARA AÑADIR EJERCICIOS POR TIPO ==========

    addManualExercise(exercise) {
        const library = this.getExerciseLibrary();
        const newExercise = {
            ...exercise,
            id: Date.now(),
            type: 'manual'
        };
        
        library.manual = library.manual || [];
        library.manual.push(newExercise);
        localStorage.setItem(this.storageKeys.EXERCISE_LIBRARY, JSON.stringify(library));
        return newExercise;
    }

    addSupersetExercise(exercise) {
        const library = this.getExerciseLibrary();
        const newExercise = {
            ...exercise,
            id: Date.now() + 1000, // IDs altos para superseries
            type: 'superset'
        };
        
        library.superset = library.superset || [];
        library.superset.push(newExercise);
        localStorage.setItem(this.storageKeys.EXERCISE_LIBRARY, JSON.stringify(library));
        return newExercise;
    }

    addSupersetGroup(group) {
        const library = this.getExerciseLibrary();
        const newGroup = {
            ...group,
            id: Date.now() + 2000, // IDs más altos para grupos
            type: 'supersetGroup'
        };
        
        library.supersetGroups = library.supersetGroups || [];
        library.supersetGroups.push(newGroup);
        localStorage.setItem(this.storageKeys.EXERCISE_LIBRARY, JSON.stringify(library));
        return newGroup;
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