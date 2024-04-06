import toast from "react-hot-toast";
import {editProvinceErrors} from "./province.service";

export const departmentItems = [
  {label: 'DÉSIGNATION', key: 'name', status: 'desc'},
  {label: 'TOTAL AGENTS', key: 'left_over', status: 'desc'},
  {label: 'TOTAL SERVICES', key: 'left_over', status: 'desc'},
]

export const serviceItems = [
  {label: 'DÉSIGNATION', key: 'name', status: 'desc'},
  {label: 'SLUG', key: 'sex', status: 'desc'},
]

export const onDepActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    case 'delete':
      toggleOpen()
      break
    default:
      navigate(`/app/departments/${data.id}/${data?.slug}`)
      break
  }
}

export const onHandleHideDepModal = (data, setProvince, setErrors, onHide): void => {
  setProvince({
    id: data.id,
    name: data.name,
  })
  setErrors(editProvinceErrors)
  onHide()
}

export const onAddDepSubmit = async (e, state = [], setState, onSubmit, onRefresh, onHide, setValidated, service = null): void => {
  e.preventDefault()
  setValidated(false)
  let obj = [...state]
  let items = [...state] // [{name: '', errors: {name: null}}]
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const send = await onSubmit({...item, service})
      if (send?.data) {
        obj.pop()
        if (obj.length > 0) setState(obj)
        else setState([{name: '', error: {name: null}}])
        onRefresh()
      }
      
      if (send?.error) {
        if (send.error?.data) {
          const {violations} = send.error.data
          if (violations) violations.forEach(({ message }) => {
            item.error.name = message
            items[i]['error'] = item.error
            toast.error(message)
          })
        }
      }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  if (obj.length < 1) {
    setState([{name: '', error: {name: null}}])
    onHide()
  }
}

export const onEditDepSubmit = async (e, dep, onSubmit, errors, setErrors, onRefresh, onHide, setValidated): void => {
  e.preventDefault()
  setValidated(false)
  setErrors(editProvinceErrors)
  try {
    const send = await onSubmit(dep)
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

export const onAddServSubmit = async (e, state = [], setState, onSubmit, onRefresh, onHide, setValidated, department): void => {
  e.preventDefault()
  setValidated(false)
  let obj = [...state]
  let items = [...state] // [{name: '', errors: {name: null}}]
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const send = await onSubmit({...item, department})
      if (send?.data) {
        obj.pop()
        if (obj.length > 0) setState(obj)
        else setState([{name: '', error: {name: null}}])
        onRefresh()
      }
      
      if (send?.error) {
        if (send.error?.data) {
          const {violations} = send.error.data
          if (violations) violations.forEach(({ message }) => {
            item.error.name = message
            items[i]['error'] = item.error
            toast.error(message)
          })
        }
      }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  if (obj.length < 1) {
    setState([{name: '', error: {name: null}}])
    onHide()
  }
}

export const onAddSubDepSubmit = async (e, state = [], setState, onSubmit, onRefresh, onHide, setValidated, department): void => {
  e.preventDefault()
  setValidated(false)
  let obj = [...state]
  let items = [...state] // [{name: '', errors: {name: null}}]
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const send = await onSubmit({...item, parent: department})
      if (send?.data) {
        obj.pop()
        if (obj.length > 0) setState(obj)
        else setState([{name: '', error: {name: null}}])
        onRefresh()
      }
      
      if (send?.error) {
        if (send.error?.data) {
          const {violations} = send.error.data
          if (violations) violations.forEach(({ message }) => {
            item.error.name = message
            items[i]['error'] = item.error
            toast.error(message)
          })
        }
      }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  if (obj.length < 1) {
    setState([{name: '', error: {name: null}}])
    onHide()
  }
}

export const onServActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      toggleShow()
      break
    case 'delete':
      toggleOpen()
      break
    default:
      navigate(`/app/services/${data.id}/${data?.slug}`)
      break
  }
}
