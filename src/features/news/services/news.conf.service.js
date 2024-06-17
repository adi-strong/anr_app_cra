export const newsFields = {
  pictures: [],
  priority: 'none',
  title: '',
  subTitle: '',
  content: '',
  address: '',
  sort: 'none',
  isTreated: false,
}

export const newsActionItems = [
  {title: 'Voir', event: 'show'},
  {title: 'Affecter', event: 'assignment'},
]

export const newsErrors = {
  pictures: null,
  sort: null,
  priority: null,
  title: null,
  subTitle: null,
  content: null,
  isTreated: null,
}

export const newsPriorityOptions = [
  { value: 'none', label: '-- Niveau de priorité --' },
  { value: 'normal', label: 'NORMALE' },
  { value: 'urgent', label: 'URGENT' },
  { value: 'very_urgent', label: 'TRÈS URGENT' },
]

export const newsSortOptions = [
  { value: 'none', label: '-- Niveau de classification --' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'A3', label: 'A3' },
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'B3', label: 'B3' },
  { value: 'B4', label: 'B4' },
  { value: 'B5', label: 'B5' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
  { value: 'C3', label: 'C3' },
  { value: 'C4', label: 'C4' },
  { value: 'C5', label: 'C5' },
  { value: 'D1', label: 'D1' },
  { value: 'D2', label: 'D2' },
  { value: 'D3', label: 'D3' },
  { value: 'D4', label: 'D4' },
  { value: 'D5', label: 'D5' },
  { value: 'E1', label: 'E1' },
  { value: 'E2', label: 'E2' },
  { value: 'E3', label: 'E3' },
  { value: 'E4', label: 'E4' },
  { value: 'E5', label: 'E5' },
]

export const newsItems = [
  {label: 'PRIORITÉ'},
  {label: 'TITRE'},
  {label: 'DÉPARTEMENT'},
  {label: 'DATE'},
]

export const newsPriorityLabel = {
  none: 'NORMALE',
  normal: 'NORMALE',
  urgent: 'URGENT',
  very_urgent: 'TRÈS URGENT',
}

export const newsPriorityColor = {
  none: 'dark',
  normal: 'primary',
  urgent: 'warning',
  very_urgent: 'danger',
}
