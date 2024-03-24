import toast from "react-hot-toast";
import {saveMessage} from "../../../services";

// VAR & CONST
export const patientItems = [
  {label: 'NOM', key: 'name', status: 'desc'},
  {label: 'ÂGE', key: 'age', status: 'desc'},
  {label: 'ÉTAT-CIVIL', key: 'status', status: 'desc'},
  {label: 'CONVENTION', key: 'status', status: 'desc'},
]

export const patientFields = {
  file: [],
  society: null,
  name: '',
  lastName: '',
  firstName: '',
  sex: '',
  status: '',
  address: '',
  nationality: '',
  father: '',
  mother: '',
  birthPlace: '',
  birthDate: '',
  isAnAdult: false,
  email: '',
  phone: '',
}
export const patientErrors = {
  file: null,
  society: null,
  name: null,
  lastName: null,
  firstName: null,
  sex: null,
  status: null,
  address: null,
  nationality: null,
  father: null,
  mother: null,
  birthPlace: null,
  birthDate: null,
  email: null,
  phone: null,
}

export const covenantItems = [
  {label: 'DÉNOMINATION', key: 'name', status: 'desc'},
  {label: 'POINT FOCAL', key: 'focal', status: 'desc'},
  {label: 'N° TÉL.', key: 'phone', status: 'desc'},
  {label: 'EMAIL', key: 'email', status: 'desc'},
]

export const covenantFields = {
  name: '',
  file: [],
  focal: '',
  phone: '',
  email: '',
  address: '',
  longitude: '',
  latitude: '',
}

export const covenantErrors = {
  name: null,
  file: null,
  focal: null,
  phone: null,
  email: null,
  address: null,
  longitude: null,
  latitude: null,
}
// END VAR & CONST

/* *************************************************************************** */
/* *************************************************************************** */

// FUNCTIONS
export const onPatientFilterClick = (patient, event, navigate) => {
  switch (event) {
    default:
      navigate(`/app/patients/${1}/show`)
      break
  }
}

export const onPatientReset = (setFields, setErrors) => {
  setErrors(patientErrors)
  setFields(patientFields)
}

export const onPatientSubmit = async (
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
  
  toast.success('Enregistrement bien efféctué.')
  onPatientReset(setFields, setErrors)
}

// FUNCTIONS
export const onCovenantSubmit = async (
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
  
  toast.success(saveMessage)
  // onPatientReset(setFields, setErrors)
}

export const onCovenantReset = (setFields, setErrors) => {
  setErrors(covenantErrors)
  setFields(covenantFields)
}
// END FUNCTIONS

/* *************************************************************************** */
/* *************************************************************************** */
