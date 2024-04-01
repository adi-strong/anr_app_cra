// VAR & CONST
const title = document.querySelector('title')

export const nbPageOptions = [
  {label: '1', value: 1},
  {label: '5', value: 5},
  {label: '15', value: 15},
  {label: '25', value: 25},
  {label: '50', value: 50},
  {label: '75', value: 75},
  {label: '100', value: 100},
]

export const sexLabel = {H: 'Homme', F: 'Femme'}

export const sexOptions = [
  {label: '-- Sélection du sexe --', value: ''},
  {label: 'Homme', value: 'H'},
  {label: 'Femme', value: 'F'},
]

export const maritalStatusOptions = [
  {label: '-- Veuillez sélectionner l\'état-civil --', value: ''},
  {label: 'Célibataire', value: 'single'},
  {label: 'Marié(e)', value: 'married'},
]

export const maritalStatusLabel = {
  single: 'Célibataire',
  married: 'Marié(e)',
}

export const stateLabel = {
  active: 'ACTIF',
  unavailable: 'INDISPONIBLE',
  suspended: 'SUSPENDUE',
  leave: 'CONGÉ',
  inactive: 'INACTIF',
}

export const stateColor = {
  active: 'success',
  unavailable: 'dark',
  suspended: 'danger',
  leave: 'primary',
  inactive: 'secondary',
}

export const actionItems = [
  {title: 'Voir', event: 'show'},
  {title: 'Modifier', event: 'edit'},
  {title: 'Supprimer', event: 'delete', className: 'text-danger'},
]

export const monthOptions = [
  {label: '-- Aucun mois sélectionné --', value: ''},
  {label: 'Janvier', value: '01'},
  {label: 'Février', value: '02'},
  {label: 'Mars', value: '03'},
  {label: 'Avril', value: '04'},
  {label: 'Mai', value: '05'},
  {label: 'Juin', value: '06'},
  {label: 'Juillet', value: '07'},
  {label: 'Aôut', value: '08'},
  {label: 'Septembre', value: '09'},
  {label: 'Octobre', value: '10'},
  {label: 'Novembre', value: '11'},
  {label: 'Décembre', value: '12'},
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
    case 'date':
      value = target.value
      break
    case 'number':
      value = isNaN(parseFloat(target.value)) || target.value < 0 ? '' : target.value
      break
    default:
      value = target.value
      break
  }
  
  values[index][target.name] = value
  setState({...state, [items]: values})
}

export const onRemoveArrayItem = (index, item: string, items = [], state, setState): void => {
  const values = [...items]
  values.splice(index, 1)
  setState({...state, [item]: values})
}
// END FUNCTIONS
