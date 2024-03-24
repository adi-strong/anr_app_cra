import toast from "react-hot-toast";
import {finCategories} from "./finances.service";

export const onAddExpenseCatItem = (fields, setFields) => {
  setFields([
    ...fields, {
    name: '', error: {name: null}
  }])
}

export const onRemoveExpenseCatItem = (index, fields, setFields) => {
  const values = [...fields]
  values.splice(index, 1)
  if (values.length < 1) setFields([{name: '', error: {name: null}}])
  else setFields(values)
}

export const onExpenseCatItemChange = (event, index, fields, setFields) => {
  let value
  const target = event.target
  const values = [...fields]
  if (target.type === 'number') {
    value = isNaN(parseFloat(target.value)) || target.value < 0 ? 0 : target.value
  }
  else value = target.value
  
  values[index][target.name] = value
  setFields(values)
}

export const onExpCatSubmit = async (
  e,
  fields,
  setFields,
  setValidated
): void => {
  e.preventDefault()
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.stopPropagation();
  }
  setValidated(false)
  
  toast.success('Enregistrement bien efféctué.')
  setFields(finCategories)
}

export const onExpCatReset = (fields, setFields) => {
  setFields([{name: '', error: {name: null}}])
}
