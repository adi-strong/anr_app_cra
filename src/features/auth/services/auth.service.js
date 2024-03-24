// VAR & CONST

import toast from "react-hot-toast";
import {getCredentials} from "./auth.slice";

export const credentials = {username: '', password: ''}

// *************************************************************************************
// *************************************************************************************

// FUNCTIONS

const onCredentialsReset = setState => {
  setState(credentials)
}

export const onCredentialSubmit = async (e, fields, setFields, navigate, request, setError, dispatch): void => {
  e.preventDefault()
  setError(null)
  try {
    const send = await request(fields)
    if (!send?.error) {
      toast.success('Bienvenue ❗', {
        icon: '😊',
        style: {
          background: 'green',
          color: '#fff'
        }
      })
      dispatch(getCredentials(send.data.token))
      onCredentialsReset(setFields)
      navigate('/app/dashboard', {replace: true})
    }
    else setError(send.error.data.message)
  } catch (e) {
    toast.error('Problème de connexion.')
  }
}
