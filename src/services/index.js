// VAR & CONST
const title = document.querySelector('title')

export const nbPageOptions = [
  {label: '5', value: 5},
  {label: '15', value: 15},
  {label: '25', value: 25},
  {label: '50', value: 50},
  {label: '75', value: 75},
  {label: '100', value: 100},
]

export const sexOptions = [
  {label: '-- Sélection du sexe --', value: ''},
  {label: 'Homme', value: 'h'},
  {label: 'Femme', value: 'f'},
]

export const maritalStatusOptions = [
  {label: '-- Veuillez sélectionner l\'état-civil --', value: ''},
  {label: 'Célibataire', value: 'single'},
  {label: 'Marié(e)', value: 'married'},
]

export const actionItems = [
  {title: 'Voir', event: 'show'},
  {title: 'Modifier', event: 'edit'},
  {title: 'Supprimer', event: 'delete', className: 'text-danger'},
]

export const saveMessage = 'Enregistrement bien efféctué'
export const operationMessage = 'Opération bien efféctuée'
export const editMessage = 'Modification bien efféctuée'
export const deleteMessage = 'Suppression bien efféctuée'
// END VAR & CONST

// *************************************************************************************
// *************************************************************************************

// FUNCTIONS
export const setPageTitle = (str: string): void => {
  title.innerText = 'CO | ' + str
}

export const onArrayChange = (e, index, item: string, items = [], state, setState): void => {
  let value
  const target = e.target
  const values = [...items]
  
  switch (target.type) {
    case 'checkbox':
      value = target.checked
      break
    case 'number':
      value = isNaN(parseFloat(target.value)) || target.value < 0 ? '' : target.value
      break
    default:
      value = target.value
      break
  }
  
  values[index][target.name] = value
  setState({...state, [item]: values})
}

export const onRemoveArrayItem = (index, item: string, items = [], state, setState): void => {
  const values = [...items]
  values.splice(index, 1)
  setState({...state, [item]: values})
}
// END FUNCTIONS
