export const onFieldChange = (e, state, setState): void => {
  const target = e.target
  let value
  
  switch (target.type) {
    case 'checkbox':
      value = target.checked
      break
    case 'file':
      value = target.files[0]
      break
    case 'number':
      value = isNaN(parseFloat(target.value)) || target.value < 0 ? '' : target.value
      break
    default:
      value = target.value
      break
  }
  
  setState({...state, [target.name]: value})
}

export const onDatePickerChange = (e, name, state, setState) => {
  setState({
    ...state,
    [name]: e
  })
}
