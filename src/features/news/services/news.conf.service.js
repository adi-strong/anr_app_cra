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
  { value: 'c1', label: 'C1' },
  { value: 'c2', label: 'C2' },
  { value: 'c3', label: 'C3' },
]

export const newsItems = [
  {label: 'PRIORITÉ'},
  {label: 'TITRE'},
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
