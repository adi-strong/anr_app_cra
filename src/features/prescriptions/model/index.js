// VAR & CONST
export const orderItems = [
  {label: 'FICHE', key: 'file', status: 'desc'},
  {label: 'PATIENT(E)', key: 'patient', status: 'desc'},
  {label: 'MÉDECIN', key: 'doctor', status: 'desc'},
  {label: 'DATE', key: 'date', status: 'desc'},
]

export const respOptions = [
  {label: '-- Acune option sélectionnée --', value: ''},
  {label: 'Patient(e)', value: 'patient'},
  {label: 'Remboursable', value: 'refundable'},
]

export const respLabel = {
  patient: 'Patient(e)',
  refundable: 'Remboursable',
}

export const prescriptionFields = {
  releasedAt: new Date(),
  comment: '',
  orders: [{medicine: '', directing: '', responsibilityOf: ''}]
}

export const prescriptionErrors = {
  releasedAt: null,
  comment: null,
  orders: null,
}
// END VAR & CONST

/* *************************************************************************** */
/* *************************************************************************** */

// FUNCTIONS
export const onAddPrescriptionItem = (fields, setFields) => {
  const orders = [...fields.orders]
  orders.push({medicine: '', directing: ''})
  setFields({...fields, orders})
}
// END FUNCTIONS

/* *************************************************************************** */
/* *************************************************************************** */
