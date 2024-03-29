import Select from "react-select";
import AsyncSelect from "react-select/async";
import {Form} from "react-bootstrap";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px',
  },
  optionImage: {
    width: '24px',
    height: '1.5rem',
    marginRight: '8px',
  },
}

export default function ReactSelectField({autoFocus = false, required = false, cacheOptions = true, style = {}, isAsync = false, isMulti = false, disabled = false, error = null, values = [], placeholder, value, onChange, label, name, onLoadOptions}) {
  const customOptionLabel = ({ label, image }) => (
    <div>
      {image && <img src={image} alt="" style={customStyles.optionImage}/>}
      <span>{label}</span>
    </div>
  )

  return (
    <>
      {label && <Form.Label htmlFor={name}>{label} {required && <code>*</code>}</Form.Label>}
      {isAsync
        ?
        <AsyncSelect
          autoFocus={autoFocus}
          cacheOptions={cacheOptions}
          required={required}
          id={name}
          name={name}
          placeholder={placeholder}
          isDisabled={disabled}
          defaultOptions={values}
          onChange={onChange}
          loadOptions={onLoadOptions}
          value={value}
          isMulti={isMulti}
          getOptionLabel={({ label, image }) =>
            customOptionLabel({ label, image })
          }
          theme={(theme) => ({
            ...theme,
            border: '1px solid #dee2e6',
            borderRadius: 4,
            fontSize: '0.875rem',
          })}
          closeMenuOnSelect
          isClearable />
        :
        <Select
          autoFocus={autoFocus}
          isClearable
          isMulti={isMulti}
          isDisabled={disabled}
          id={name}
          name={name}
          required={required}
          options={values}
          getOptionLabel={({ label, image }) =>
            customOptionLabel({ label, image })
          }
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          getOptionValue={option => option.value}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            border: '1px solid #dee2e6',
            borderRadius: 4,
            fontSize: '0.875rem',
          })}/>}
    </>
  )
}
