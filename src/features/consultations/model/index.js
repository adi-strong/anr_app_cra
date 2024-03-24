// VAR & CONST
import toast from "react-hot-toast";
import {operationMessage} from "../../../services";

export const consultItems = [
  {label: 'ID', key: 'id', status: 'desc'},
  {label: 'FICHE', key: 'file', status: 'desc'},
  {label: 'PATIENT(E)', key: 'patient', status: 'desc'},
  {label: 'DATE', key: 'date', status: 'desc'},
]

export const consultFields = {
  type: null,
  patient: null,
  bed: null,
  startHospAt: '',
  endHospAt: '',
  temperature: '',
  weight: '',
  bloodPressure: '',
  cardiacFrequency: '',
  respiratoryRate: '',
  oxygenSaturation: '',
  observations: [{releasedAt: new Date(), content: '', isDone: false}],
  medicalBackground: '',
  specialMentions: '',
  surgical: '',
  family: '',
}
export const consultErrors = {
  type: null,
  patient: null,
  bed: null,
  startHospAt: null,
  endHospAt: null,
  temperature: null,
  weight: null,
  bloodPressure: null,
  cardiacFrequency: null,
  respiratoryRate: null,
  oxygenSaturation: null,
  medicalBackground: null,
  specialMentions: null,
  surgical: null,
  family: null,
}
// END VAR & CONST

/* *************************************************************************** */
/* *************************************************************************** */

// FUNCTIONS
export const onConsultationSubmit = async (
  e,
  fields,
  setFields,
  errors,
  setErrors,
  setValidated
): void => {
  e.preventDefault()
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.stopPropagation();
  }
  setValidated(false)
  
  toast.success(operationMessage)
  onConsultationReset(setFields, setErrors)
}

export const onConsultationReset = (setFields, setErrors) => {
  setErrors(consultErrors)
  setFields(consultFields)
}
// END FUNCTIONS

/* *************************************************************************** */
/* *************************************************************************** */
