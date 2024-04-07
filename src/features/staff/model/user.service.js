export const userItems = [
  {label: 'Username', key: 'username', status: 'desc'},
  {label: 'Nom complet', key: 'full_name', status: 'desc'},
  {label: 'Email', key: 'email', status: 'desc'},
  {label: 'N° Tél.', key: 'left_over', status: 'desc'},
]

export const rolesOptions = [
  {label: '-- Aucun rôle sélectionné --', value: 'ROLE_USER'},
  {label: 'ADMINISTRATEUR GÉNÉRAL (AG)', value: 'ROLE_AG'},
  {label: 'ADMINISTRATEUR GÉNÉRAL ADJOINT (AGA)', value: 'ROLE_AGA'},
  {label: 'ADMINISTRATEUR PRINCIPAL D.A (A.P)', value: 'ROLE_DA'},
  {label: 'ADMINISTRATEUR PRINCIPAL D.S.I', value: 'ROLE_DSI'},
  {label: 'DIRECTEUR 100 D.A', value: 'ROLE_100_DA'},
  {label: 'ADMIN ROOT', value: 'ROLE_SUPER_ADMIN'},
]

export const roleLabel = {
  ROLE_USER: '',
  ROLE_AG: 'A.G',
  ROLE_AGA: 'D.A (A.P)',
  ROLE_DSI: 'D.S.I',
  ROLE_100_DA: 'D.A 100',
  ROLE_SUPER_ADMIN: 'S. ADMIN'
}

export const userFields = {
  username: '',
  password: '',
  confirmPassword: '',
  agentAccount: null,
  fullName: '',
  phone: '',
  email: '',
  isActive: true,
  role: '',
  roles: [],
}

export const userErrors = {
  username: null,
  password: null,
  confirmPassword: null,
  fullName: null,
  phone: null,
  email: null,
  isActive: null,
}

export const userActionItems = [
  {title: 'Voir', event: 'show'},
  {title: 'Modifier', event: 'edit'},
  {title: 'Réinitiaiser le mot de passe', event: 'reset_pass', className: 'text-danger'},
]

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

export const onUserActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    case 'reset_pass':
      toggleOpen()
      break
    default:
      navigate(`/app/users/${data.id}/show`)
      break
  }
}
