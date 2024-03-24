export const typeItems = [
  {label: 'DÉSIGNATION', key: 'name', status: 'desc'},
  {label: 'PRIX', key: 'price', status: 'desc'},
  {label: 'SLUG', key: 'slug', status: 'desc'},
]

export const consultationTypes = [{name: '', price: 0, errors: {name: null, price: null}}]

export const onAddTypeItem = (fields, setFields) => {
  setFields([
    ...fields, {
      name: '',
      price: 0,
      errors: {name: null, price: null}
    }])
}

export const onRemoveTypeItem = (index, fields, setFields) => {
  const values = [...fields]
  values.splice(index, 1)
  if (values.length < 1) setFields([{name: '', error: {name: null}}])
  else setFields(values)
}
