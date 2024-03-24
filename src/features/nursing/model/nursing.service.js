export const nursingFields = {
  releasedAt: new Date(),
  consultation: null,
  treatments: [],
  patient: null,
}

export const nursingErrors = {
  releasedAt: null,
  consultation: null,
  treatments: null,
  patient: null,
}

export const nursingTreatments = {
  releasedAt: new Date(),
  nursingTreatments: [{treatment: null, price: 0}],
  medicines: []
}

export const onNursingReset = (setFields, setErrors) => {
  setErrors(nursingErrors)
  setFields(nursingFields)
}

export const onAddNursingTreatments = (fields, setFields) => {
  const nursingTreatments = [...fields.nursingTreatments]
  nursingTreatments.push({treatment: null, price: 0})
  setFields({...fields, nursingTreatments})
}

export const onAddNursingMedicines = (fields, setFields) => {
  const medicines = [...fields.medicines]
  medicines.push({medicine: ''})
  setFields({...fields, medicines})
}
