export const labFields = {
  releasedAt: new Date(),
  patient: null,
  consultation: null,
  interpretation: '',
  parameters: [{
    levy: '',
    parameter: '',
    valueFound: '',
    referenceValue: '',
    unit: '',
    observation: '',
  }]
}

export const labErrors = {
  releasedAt: null,
  patient: null,
  consultation: null,
  parameters: null,
}

export const labObserverOptions = [
  {label: '-- --', value: ''},
  {label: 'Normal', value: 'normal'},
  {label: 'Haut', value: 'high'},
  {label: 'Bas', value: 'down'},
]

export const labObserverLabel = {
  normal: 'Normal',
  high: 'Haut',
  down: 'Bas',
}

export const onAddLabItem = (fields, setFields) => {
  const parameters = [...fields.parameters]
  parameters.push({levy: '', parameter: '', valueFound: '', referenceValue: '', unit: '', observation: '' })
  setFields({...fields, parameters})
}
