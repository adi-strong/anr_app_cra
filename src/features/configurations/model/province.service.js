import toast from "react-hot-toast";

export const provinceItems = [
  {label: 'PROVINCE', key: 'name', status: 'desc'},
  {label: 'SLUG', key: 'slug', status: 'desc'},
]

export const provinceFields = [{name: '', errors: {name: null}}]

export const editProvinceFields = {id: null, name: ''}

export const editProvinceErrors = {id: null, name: null}

export const onAddTypeItem = (fields, setFields): void => {
  setFields([
    ...fields, {
      name: '',
      price: 0,
      errors: {name: null, price: null}
    }])
}

export const onProvinceActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    case 'delete':
      toggleOpen()
      break
    default:
      navigate(`/app/provinces/${data.id}/${data?.slug}`)
      break
  }
}

export const onHandleHideProvinceModal = (data, setProvince, setErrors, onHide): void => {
  setProvince({
    id: data.id,
    name: data.name,
  })
  setErrors(editProvinceErrors)
  onHide()
}

export const onEditProvinceSubmit = async (e, province, onSubmit, errors, setErrors, onRefresh, onHide, setValidated): void => {
  e.preventDefault()
  setValidated(false)
  setErrors(editProvinceErrors)
  try {
    const send = await onSubmit(province)
    if (!send?.error) {
      toast.success('Modification bien efféctuée.')
      onRefresh()
      onHide()
    }
    else if (send?.error) {
      setValidated(true)
      if (send.error?.data) {
        const {violations} = send.error.data
        if (violations) violations.forEach(({ propertyPath, message }) => {
          setErrors({...errors, [propertyPath]: message})
        })
      }
    }
  }
  catch (e) {
    toast.error('Problème de connexion.')
  }
}

export const onAddProvinceSubmit = async (e, state = [], setState, onSubmit, onRefresh, onHide, setValidated): void => {
  e.preventDefault()
  setValidated(false)
  let obj = [...state]
  let items = [...state] // [{name: '', errors: {name: null}}]
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const send = await onSubmit(item)
      if (send?.data) {
        obj.pop()
        if (obj.length > 0) setState(obj)
        else setState([{name: '', errors: {name: null}}])
        onRefresh()
      }
      
      if (send?.error) {
        if (send.error?.data) {
          const {violations} = send.error.data
          if (violations) violations.forEach(({ message }) => {
            item.errors.name = message
            items[i]['errors'] = item.errors
            toast.error(message)
          })
        }
      }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  if (obj.length < 1) {
    setState([{name: '', errors: {name: null}}])
    onHide()
  }
}

export const handleRemoveProvince = async (data, page, pages, onSubmit, onSearch, onRefresh, onHide, isPaginated, name, isSearched): void => {
  onHide()
  try {
    await onSubmit({...data, pages, name})
    if (isPaginated) onRefresh(page)
    if (isSearched) onSearch(null, name)
  }
  catch (e) { toast.error('Problème de connexion.') }
}
