import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import {finCatItems} from "../model/finances.service";
import ExpenseCategoryItem from "./expenseCategoryItem";
import AddExpenseCategoriesForm from "./addExpenseCategoriesForm";

export default function ExpenseCategoriesList() {
  const [search, setSearch] = useState({keyword: ''})
  const [open, setOpen] = useState(false)
  
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>Liste des catégories de dépenses</Card.Title>
        
        <Row>
          <Col md={6} className='mb-2 d-flex'>
            <Button className='me-1 mb-1' onClick={toggleOpen}>
              Enregistrement <i className='bi bi-chevron-double-right'/>
            </Button>
            
            <Form.Group className='mb-1'>
              <Form.Select
                disabled={false}
                value={nbPages}
                onChange={({target}) =>
                  dispatch(onSetNbPages(target.value))}
                onClick={() => {}}>
                {nbPageOptions.map(o =>
                  <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col className='mb-2'>
            <div className='justify-content-md-end'>
              <Form onSubmit={e => e.preventDefault()}>
                <Form.Control
                  disabled={false}
                  name='keyword'
                  placeholder='Rechercher'
                  value={search.keyword}
                  onChange={e => onFieldChange(e, search, setSearch)}/>
              </Form>
            </div>
          </Col>
        </Row>
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {finCatItems.length > 0 && finCatItems.map((f, i) =>
              <th key={i} className='align-middle'>{f.label}</th>)}
            <th className='text-end text-primary'>
              <i className='bi bi-arrow-clockwise' style={{ cursor: 'pointer' }}/>
            </th>
          </tr>
          </thead>
          
          <tbody>
          <ExpenseCategoryItem/>
          </tbody>
        </Table>
      </div>
      
      <AppOffCanvas
        show={open}
        onHide={toggleOpen}
        title={<><i className='bi bi-plus'/> Enregistrement catégories</>}
        children={<AddExpenseCategoriesForm onHide={toggleOpen}/>}/>
    </ErrorBoundary>
  )
}
