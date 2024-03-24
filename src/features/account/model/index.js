// VAR & CONST
import toast from "react-hot-toast";

export const profileTabs = [
  {title: 'Aperçu', event: 'overview'},
  {title: 'Mot de Passe', event: 'password'},
  {title: 'Rendez-Vous', event: 'rendezvous'},
]

export const accountPasswordFields = {
  password: '',
  repeatPassword: '',
}
export const accountPasswordErrors = {
  password: null,
  repeatPassword: null,
}

export const rdvItems = [
  {label: 'Motif'},
  {label: 'Date'},
  {label: <i className='bi bi-check2-circle'/>},
]

export const editProfileFields = {
  username: '',
  file: '',
  phone: '',
  email: '',
  address: '',
  birthDate: '',
  bio: '',
}
export const editProfileErrors = {
  username: null,
  file: null,
  phone: null,
  email: null,
  address: null,
  birthDate: null,
  bio: null,
}
// END VAR & CONST

/* *************************************************************************** */
/* *************************************************************************** */

// FUNCTIONS
export const onResetPassword = (setFields, setErrors): void => {
  setErrors(accountPasswordErrors)
  setFields(accountPasswordFields)
}

export const onPasswordSubmit = async (
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
  
  if (fields.password !== fields.repeatPassword) {
    setErrors({...errors, repeatPassword: 'Mots de passe non identiques.'})
    setValidated(false)
  }
  else {
    toast.success('Modification bien efféctuée.')
    onResetPassword(setFields, setErrors)
  }
}
// END FUNCTIONS

/* *************************************************************************** */
/* *************************************************************************** */
