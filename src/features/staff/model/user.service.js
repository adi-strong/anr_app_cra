import {setAuthUser} from "../../auth/services/auth.slice";

export const userItems = [
  {label: 'Username', key: 'username', status: 'desc'},
  {label: 'Nom complet', key: 'full_name', status: 'desc'},
  {label: 'Email', key: 'email', status: 'desc'},
  {label: 'N° Tél.', key: 'left_over', status: 'desc'},
]

export const userFields = {
  username: '',
  password: '',
  confirmPassword: '',
  agent: null,
  fullName: '',
  phone: '',
  email: '',
  isActive: false,
}

export const userErrors = {
  username: null,
  password: null,
  confirmPassword: null,
  agent: null,
  fullName: null,
  phone: null,
  email: null,
  isActive: null,
}

export const onAuthUser = (session, dispatch, setAuthUser) => {
  dispatch(setAuthUser({
    id: session.id,
    username: session.username,
    fullName: session.fullName,
    roles: session.roles,
    phone: session?.phone ? session.phone : null,
    email: session.email,
    image: null,
  }))
}
