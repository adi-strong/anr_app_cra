export const rdvItems = [
  {label: 'ID', key: 'id', status: 'desc'},
  {label: 'MÉDECIN', key: 'reason', status: 'desc'},
  {label: 'PATIENT(E)', key: 'patient', status: 'desc'},
  {label: 'DATE & HEURE', key: 'date', status: 'desc'},
]

export const rdvFields = {
  isSelected: false,
  patient: null,
  thePatient: '',
  releasedAt: new Date(),
  doctor: null,
  reason: '',
}

export const rdvErrors = {
  isSelected: null,
  patient: null,
  thePatient: null,
  releasedAt: null,
  doctor: null,
  reason: null,
}
