export const yearActionItems = [
  {title: 'Voir', event: 'show'},
  {title: 'Éditer', event: 'edit'},
]

export const onYearActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    default:
      navigate(`/app/years/${data.id}/${data?.slug}`)
      break
  }
}
