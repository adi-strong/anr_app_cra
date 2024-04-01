export const salaryItems = [
  {label: 'SALAIRE DE BASE', key: 'place', status: 'desc'},
  {label: 'P. DE RISQUE', key: 'left_over', status: 'desc'},
  {label: 'P. DE FONCTION', key: 'left_over', status: 'desc'},
  {label: 'NET PAYÉ', key: 'left_over', status: 'desc'},
]

export const salary2Items = [
  {label: 'AGENT', key: 'place', status: 'desc'},
  {label: 'SALAIRE DE BASE', key: 'place', status: 'desc'},
  {label: 'P. DE RISQUE', key: 'left_over', status: 'desc'},
  {label: 'P. DE FONCTION', key: 'left_over', status: 'desc'},
  {label: 'NET PAYÉ', key: 'left_over', status: 'desc'},
]

export const salaryFields = {
  baseAmount: 0,
  riskPremiumAmount: 0,
  functionBonusAmount: 0,
  month: '',
  year: null,
  currency: null,
  rate: 0,
}

export const salaryErrors = {
  baseAmount: null,
  riskPremiumAmount: null,
  functionBonusAmount: null,
  month: null,
  year: null,
  currency: null,
  rate: null,
}
