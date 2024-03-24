export const covContractItems = [
  {label: 'DÉBUT', key: 'start_at', status: 'desc'},
  {label: 'FIN', key: 'end_at', status: 'desc'},
  {label: 'DURÉE', key: 'duration', status: 'desc'},
  {label: 'FICHIER', key: 'file', status: 'desc'},
]

export const approvedPatientItems = [
  {label: 'NOM', key: 'name', status: 'desc'},
  {label: 'SEXE', key: 'sex', status: 'desc'},
  {label: 'ÂGE', key: 'age', status: 'desc'},
  {label: 'ÉTAT-CIVIL', key: 'status', status: 'desc'},
]

export const covContractFields = {
  startAt: '',
  endAt: '',
  file: '',
  covenant: null,
}

export const covContractErrors = {
  startAt: null,
  endAt: null,
  file: null,
  covenant: null,
}

export const onCovenantFilterClick = (covenant, event, navigate) => {
  switch (event) {
    default:
      navigate(`/app/covenants/${1}/show`)
      break
  }
}
