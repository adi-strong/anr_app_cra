export const societyItems = [
  {label: 'DÉSIGNATION'},
  {label: 'NOM COMMERCIAL'},
  {label: 'P. FOCAL'},
  {label: 'N° TÉL.'},
]

export const societyFields = {
  type: null,
  province: null,
  name: '',
  tradeName: '',
  rccmFile: '',
  address: '',
  phone: '',
  focal: '',
}

export const societyErrors = {
  type: null,
  province: null,
  name: null,
  tradeName: null,
  rccmFile: null,
  address: null,
  phone: null,
  focal: null,
}

export const onSocietyActionsFilter = (event, data, navigate, toggleShow): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    default:
      navigate(`/app/societies/${data.id}/show`)
      break
  }
}
