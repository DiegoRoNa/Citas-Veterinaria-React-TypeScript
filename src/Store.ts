import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { DraftPatient, Patient } from "./types";


type PatientState = {
    patients: Patient[] // arreglo de pacientes
    activeId: Patient['id'] // id del paciente a editar
    addPatient: (data: DraftPatient) => void // funcion para agregar paciente
    deletePatient: (id: Patient['id']) => void // funcion para eliminar un paciente
    getPatientById: (id: Patient['id']) => void // funcion para obtener info del paciente a editar
    updatePatient: (data: DraftPatient) => void // funcion para editar un paciente
}

// toma un paciente sin id, y retorna un paciente con id
const createPatient = (patient: DraftPatient) : Patient => {
    return {...patient, id: uuidv4()}
}

export const usePatientStore = create<PatientState>()(
    devtools(
        persist((set) => ({ // persist, permite almacenar en session o localstorage
            patients: [],
            activeId: '',
            addPatient: (data) => {
                // agregar el id al paciente nuevo
                const newPatient = createPatient(data)
    
                set((state) => ({
                    patients: [...state.patients, newPatient]
                }))
            },
            deletePatient: (id) => {
                set((state) => ({
                    patients: state.patients.filter( patient => patient.id !== id)
                }))
            },
            getPatientById: (id) => {
                set(() => ({
                    activeId: id
                }))
            },
            updatePatient: (data) => {
                set((state) => ({
                    patients: state.patients.map(
                        patient => patient.id === state.activeId ? {...data, id: state.activeId} : patient
                    ), 
                    activeId: ''
                }))
            }
        }), {
            name: 'patient-storage',
            storage: createJSONStorage(() => localStorage) // sessionStorage: para session
        })
    )
)