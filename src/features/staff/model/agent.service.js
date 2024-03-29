export const agentItems = [
  {label: 'NOM', key: 'name', status: 'desc'},
  {label: 'SEXE', key: 'sex', status: 'desc'},
  {label: 'N° Tél', key: 'left_over', status: 'desc'},
  {label: 'SERVICE', key: 'left_over', status: 'desc'},
]

export const agentFields = {
  file: [],
  province: null,
  department: null,
  service: null,
  grade: null,
  job: null,
  name: '',
  lastName: '',
  firstName: '',
  bornPlace: '',
  cartNumber: '',
  pseudo: '',
  sex: '',
  maritalStatus: '',
  bornAt: '',
  origin: '',
  father: '',
  mother: '',
  conjoint: '',
  children: [],
  blood: '',
  levelOfStudies: '',
  godFather: '',
  godFatherNum: '',
  state: '',
  address: '',
  email: '',
  phone: '',
  conjointOrigin: '',
  register: '',
}

export const agentErrors = {
  province: null,
  file: null,
  department: null,
  service: null,
  grade: null,
  job: null,
  name: null,
  lastName: null,
  firstName: null,
  cartNumber: null,
  pseudo: null,
  bornPlace: null,
  sex: null,
  maritalStatus: null,
  bornAt: null,
  origin: null,
  father: null,
  mother: null,
  conjoint: null,
  children: null,
  blood: null,
  levelOfStudies: null,
  godFather: null,
  godFatherNum: null,
  state: null,
  address: null,
  email: null,
  phone: null,
  conjointOrigin: null,
  register: null,
}

export const bloodOptions = [
  {label: '-- Aucun groupe sanguin sélectionné --', value: ''},
  {label: 'A', value: 'A'},
  {label: 'B', value: 'B'},
  {label: 'O', value: 'O'},
  {label: 'OB', value: 'OB'}
]

export const agentActionItems = [
  {title: 'Voir', event: 'show'},
  {title: 'Modifier', event: 'edit'},
]

export const onAgentActionsFilter = (event, data, navigate, toggleShow): void => {
  switch (event) {
    case 'edit':
      navigate(`/app/agents/${data.id}/edit`)
      break
    case 'delete':
      toggleShow()
      break
    default:
      navigate(`/app/agents/${data.id}/show`)
      break
  }
}
