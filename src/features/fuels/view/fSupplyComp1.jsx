import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Form, Modal, Spinner, Table} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import {useSelector} from "react-redux";

const thItems = [
  {label: 'Qté'},
  {label: 'Site'},
  {label: 'Carburant'},
]

function ConfirmModal({show, onHide, onSubmit}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className='bg-warning'>
        <Modal.Title><i className='bi bi-exclamation-triangle-fill'/> Confirmation</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <small><code><i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.</code></small>
        <p className='text-center'>Veuillez confirmer cette opration<i className='bi bi-exclamation-triangle-fill'/></p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant='light' onClick={onHide}>
          <i className='bi bi-x'/> Annuler
        </Button>
        
        <Button autoFocus variant='warning' onClick={onSubmit}>
          <i className='bi bi-check'/> Valider
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default function FSupplyComp1({state, setState, onReset, onRemoveItem, onSubmit, loader = false, show, toggleShow}) {
  const {show: theme} = useSelector(state => state.theme)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <h4 className="card-title">Formulaire d'approvisionnement</h4>
      
      <div className='mb-3'>
        <Form.Label htmlFor='createdAt'>Date</Form.Label>
        <Form.Control
          disabled={loader}
          id='createdAt'
          name='createdAt'
          type='date'
          value={state.createdAt}
          onChange={e => onFieldChange(e, state, setState)}/>
      </div>
      
      <div>
        <Table responsive bordered>
          <thead className='bg-light'>
          <tr>
            {thItems.length > 0 && thItems.map((t, i) =>
              <th key={i} className='align-middle p-1 text-center'>{t.label}</th>)}
            <th className='align-middle text-center p-1'>
              <i className='text-danger bi bi-trash' onClick={onReset} style={{ cursor: 'pointer' }}/>
            </th>
          </tr>
          </thead>
          
          <tbody>
          {state?.items?.length > 0 && state.items?.map((f, i) =>
            <tr key={i}>
              <th className={`align-middle text-center p-1 text-${theme ? 'light-success' : 'dark'}`}>{f?.quantity} litre(s)</th>
              <td className='align-middle text-center p-1'>{f?.site?.label}</td>
              <td className='align-middle text-center p-1'>{f?.fuel?.label}</td>
              <td className='align-middle text-center p-1'>
                <i className='bi bi-trash' onClick={() => onRemoveItem(i)} style={{ cursor: 'pointer' }}/>
              </td>
            </tr>)}
          </tbody>
        </Table>
      </div>
      
      <Button disabled={loader} onClick={toggleShow} className='d-block w-100'>
        {loader && <Spinner animation='grow' size='sm' className='me-1'/>}
        {!loader && <i className='bi bi-check me-1'/>}
        {!loader ? 'Valider' : 'Veuillez patienter'}
      </Button>
      
      <ConfirmModal show={show} onHide={toggleShow} onSubmit={onSubmit}/>
    </ErrorBoundary>
  )
}
