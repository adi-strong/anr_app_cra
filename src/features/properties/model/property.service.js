export const propertyItems = [
  {label: 'TYPE'},
  {label: 'PROVINCE'},
  {label: 'SURFACE'},
  {label: 'PIÈCE(S)'},
  {label: 'ÉTAT'},
]

export const propertyFields = {
  type: null,
  province: null,
  postalCode: '',
  longitude: '',
  latitude: '',
  avenue: '',
  number: '',
  quarter: '',
  commune: '',
  surface: '',
  pieces: '',
  price: '',
  description: '',
}

export const propertyErrors = {
  type: null,
  province: null,
  postalCode: null,
  longitude: null,
  latitude: null,
  avenue: null,
  number: null,
  quarter: null,
  commune: null,
  surface: null,
  pieces: null,
  price: null,
  description: null,
}

export const onPropertyActionsFilter = (event, data, navigate): void => {
  switch (event) {
    case 'show':
      navigate(`/app/properties/${data.id}/show`)
      break
    case 'edit':
      navigate(`/app/properties/${data.id}/edit`)
      break
    default:
      // navigate(`/app/properties/${data.id}/show`)
      break
  }
}
