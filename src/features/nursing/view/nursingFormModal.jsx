import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FieldsAlert} from "../../../components";
import {useState} from "react";
import {nursingTreatments, onAddNursingMedicines, onAddNursingTreatments} from "../model/nursing.service";
import {Button, Card, Form, Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import {onRemoveArrayItem} from "../../../services";
import {onDatePickerChange} from "../../../services/form.handler.service";

export default function NursingFormModal({show, onHide}) {
  const [fields, setFields] =
    useState(nursingTreatments)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='bi bi-plus-square-fill'/> Traitement du patient
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <div className='mb-3'>
            <Form.Label>Date</Form.Label> <br/>
            <DatePickerForm
              disabled={false}
              label={null}
              date={fields.releasedAt}
              onChange={e => onDatePickerChange(e, 'releasedAt', fields, setFields)}
              name='releasedAt'/>
          </div>
          
          <div className='bg-light p-2'>
            <Card.Title>TRAITEMENT(s)</Card.Title>
            {fields.nursingTreatments.length > 0 && fields.nursingTreatments.map(
              (t, i) =>
                <div key={i} className='mb-1 d-flex justify-content-between'>
                  <div>
                    <Form.Text><code>*</code> Type</Form.Text>
                  </div>
                  
                  {fields.nursingTreatments.length > 1 &&
                    <Button
                      disabled={false}
                      variant='danger'
                      onClick={() => onRemoveArrayItem(
                        i,
                        'nursingTreatments',
                        fields.nursingTreatments,
                        fields,
                        setFields
                      )}>
                      <i className='bi bi-trash'/>
                    </Button>}
                </div>
            )}
            
            <Button
              disabled={false}
              variant='dark'
              className='mt-2 d-block w-100'
              size='sm'
              onClick={() => onAddNursingTreatments(fields, setFields)}>
              <i className='bi bi-plus-square-fill'/> Ajouter
            </Button>
          </div>
          
          <div className='bg-light p-2 mt-5'>
            <Card.Title>
              Médicament(s) / Produit(s) pharmaceutique(s) / Produit(s) injectable(s) / etc.
            </Card.Title>
            {fields.medicines.length > 0 && fields.medicines.map(
              (t, i) =>
                <div key={i} className='mb-1 d-flex justify-content-between'>
                  <div>
                    <Form.Text><code>*</code> Produit</Form.Text>
                  </div>
                  
                  <Button
                    disabled={false}
                    variant='danger'
                    onClick={() => onRemoveArrayItem(
                      i,
                      'medicines',
                      fields.medicines,
                      fields,
                      setFields
                    )}>
                    <i className='bi bi-trash'/>
                  </Button>
                </div>
            )}
            
            <Button
              disabled={false}
              variant='dark'
              className='mt-2 d-block w-100'
              size='sm'
              onClick={() => onAddNursingMedicines(fields, setFields)}>
              <i className='bi bi-plus-square-fill'/> Ajouter
            </Button>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button disabled={false} variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button disabled={false} onClick={onHide}>
            <i className='bi bi-check'/> Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

NursingFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}
