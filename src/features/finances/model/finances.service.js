export const finItems = [
  {label: 'MOTIF', key: 'reason', status: 'desc'},
  {label: 'BÉNÉFICIAIRE', key: 'bearer', status: 'desc'},
  {label: 'TOTAL', key: 'total', status: 'desc'},
  {label: 'DATE', key: 'date', status: 'desc'},
]


export const expTypeItems = [
  {title: 'Modifier', event: 'edit'},
  {title: 'Supprimer', event: 'delete', className: 'text-danger'},
]

export const entryItems = [
  {label: 'MOTIF', key: 'reason', status: 'desc'},
  {label: 'PORTEUR', key: 'bearer', status: 'desc'},
  {label: 'TOTAL', key: 'total', status: 'desc'},
  {label: 'DATE', key: 'date', status: 'desc'},
]

export const finCatItems = [
  {label: 'NOM', key: 'name', status: 'desc'},
  {label: 'CHARGE ?', key: 'is_load', status: 'desc'},
  {label: 'TOTAL', key: 'bearer', status: 'desc'},
  {label: 'DATE', key: 'date', status: 'desc'},
]

export const finFields = {
  isSelected: false,
  agent: null,
  currency: null,
  bearer: '',
  operations: [{name: '', qty: 0, amount: 0}],
  reason: '',
}

export const expFields = {
  isSelected: false,
  agent: null,
  currency: null,
  bearer: '',
  operations: [{type: null, qty: 0, amount: 0}],
  reason: '',
  object: '',
}

export const finErrors = {
  agent: null,
  currency: null,
  bearer: null,
  operations: null,
  reason: null,
  object: null,
}

export const finCategories = [{name: '', error: {name: null}}]

export const onFinReset = (setErrors, setFields) => {
  setErrors(finErrors)
  setFields({...finFields, agent: null, bearer: '', items: [{name: '', qty: 0, amount: 0}], reason: ''})
}

export const onAddExpenseItem = (fields, setFields) => {
  const operations = [...fields.operations]
  operations.push({name: '', qty: 0, amount: 0})
  setFields({...fields, operations})
}

export const onRemoveExpenseItem = (index, fields, setFields) => {
  const operations = [...fields.operations]
  operations.splice(index, 1)
  setFields({...fields, operations})
}

export const onExpenseItemChange = (event, index, fields, setFields) => {
  let value
  const target = event.target
  const operations = [...fields.operations]
  if (target.type === 'number') {
    value = isNaN(parseFloat(target.value)) || target.value < 0 ? '' : target.value
  }
  else value = target.value
  
  operations[index][target.name] = value
  setFields({...fields, operations})
}

export const onExpTypeActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    case 'delete':
      toggleOpen()
      break
    default:
      // navigate(`/app/services/${data.id}/${data?.slug}`)
      break
  }
}

export const onExpenseFilterAction = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    case 'delete':
      toggleOpen()
      break
    default:
      navigate(`/app/expenses/${data.id}/show`)
      break
  }
}
