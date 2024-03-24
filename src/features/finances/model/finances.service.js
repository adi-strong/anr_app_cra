export const finItems = [
  {label: 'MOTIF', key: 'reason', status: 'desc'},
  {label: 'BÉNÉFICIAIRE', key: 'bearer', status: 'desc'},
  {label: 'TOTAL', key: 'total', status: 'desc'},
  {label: 'DATE', key: 'date', status: 'desc'},
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
  items: [{name: '', qty: 0, amount: 0}],
  reason: '',
}

export const finErrors = {
  agent: null,
  currency: null,
  bearer: null,
  items: null,
  reason: null,
}

export const finCategories = [{name: '', error: {name: null}}]

export const onFinReset = (setErrors, setFields) => {
  setErrors(finErrors)
  setFields({...finFields, agent: null, bearer: '', items: [{name: '', qty: 0, amount: 0}], reason: ''})
}

export const onAddExpenseItem = (fields, setFields) => {
  const items = [...fields.items]
  items.push({name: '', qty: 0, amount: 0})
  setFields({...fields, items})
}

export const onRemoveExpenseItem = (index, fields, setFields) => {
  const items = [...fields.items]
  items.splice(index, 1)
  setFields({...fields, items})
}

export const onExpenseItemChange = (event, index, fields, setFields) => {
  let value
  const target = event.target
  const items = [...fields.items]
  if (target.type === 'number') {
    value = isNaN(parseFloat(target.value)) || target.value < 0 ? '' : target.value
  }
  else value = target.value
  
  items[index][target.name] = value
  setFields({...fields, items})
}
