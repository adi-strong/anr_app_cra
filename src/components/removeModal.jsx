import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import {Button, ButtonGroup, Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import {useState} from "react";

export default function RemoveModal({data, message, show, onHide, onRemove}) {
  const [isClicked, setIsClicked] = useState(false)
  
  const toggleIsClicked = () => setIsClicked(!isClicked)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className='bg-danger' closeButton>
          <Modal.Title className='text-light'>
            <i className='bi bi-exclamation-circle-fill'/> Suppression
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <div className='text-center'>
            <p>
              <code>
                <small className='text-primary'>
                  <i className='bi bi-exclamation-triangle-fill'/> Cette action est irréversible.
                </small>
              </code>
            </p>
            
            <code>
              Êtes-vous certain(e) de vouloir supprimer <br/>
              {message} <i className='bi bi-question-circle-fill'/>
            </code>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          {!isClicked &&
            <>
              <Button variant='light' onClick={onHide}>
                <i className='bi bi-x'/> Fermer
              </Button>
              
              <Button variant='danger' onClick={toggleIsClicked}>
                <i className='bi bi-trash'/> Supprimer
              </Button>
            </>}
          
          {isClicked &&
            <ButtonGroup>
              <Button variant='light' onClick={toggleIsClicked}>
                <i className='bi bi-x'/> Annuler
              </Button>
              
              <Button variant='danger' onClick={onRemove}>
                <i className='bi bi-exclamation-circle-fill'/> Valider
              </Button>
            </ButtonGroup>}
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

RemoveModal.propTypes = {
  data: PropTypes.any,
  message: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
