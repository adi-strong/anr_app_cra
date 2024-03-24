import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import DatePicker from 'react-datepicker';
import PropTypes from "prop-types";
import fr from 'date-fns/locale/fr'

export default function DatePickerForm(
  {
    name,
    onChange,
    date,
    label = 'Date & Heure',
    isRequired = false,
    disabled = false,
  }) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <DatePicker
        required={isRequired}
        disabled={disabled}
        showTimeSelect
        name={name}
        selected={date}
        onChange={onChange}
        dateFormat='MMMM d, yyyy HH:mm'
        locale={fr}
        className='form-control'/> {label} {label && isRequired && <code>*</code>}
    </ErrorBoundary>
  )
}

DatePickerForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  date: PropTypes.any,
}
