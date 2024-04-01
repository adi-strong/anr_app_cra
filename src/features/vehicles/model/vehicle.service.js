export const vehicleItems = [
  {label: 'TYPE'},
  {label: 'MARQUE'},
  {label: 'IMMATRICULATION'},
  {label: 'CERTIFICAT'},
  {label: 'AFFECTATION'},
]

export const vehicleFields = {
  brand: '',
  chassis: '',
  color: '',
  numberplate: '',
  certificateFile: '',
  type: null,
}

export const vehicleErrors = {
  brand: null,
  chassis: null,
  color: null,
  numberplate: null,
  certificateFile: null,
  type: null,
}

export const onVehicleActionsFilter = (event, data, navigate, toggleShow): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    default:
      // navigate(`/app/agents/${data.id}/show`)
      break
  }
}
