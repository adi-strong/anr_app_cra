import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Col, Row} from "react-bootstrap";
import FSupplyComp1 from "./fSupplyComp1";
import FSupplyComp2 from "./FSupplyComp2";
import toast from "react-hot-toast";
import {usePostNewFuelSupplyMutation} from "../model/fuel.api.slice";

const FuelSupply = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'fuels' }))
  }, [dispatch])
  
  const [state, setState] = useState({createdAt: '', items: []})
  const [fields, setFields] = useState({id: null, fuel: null, site: null, siteId: null, quantity: 0})
  const [postNewFuelSupply, {isLoading, isError, error}] = usePostNewFuelSupplyMutation()
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const onReset = () => {
    setFields({id: null, fuel: null, site: null, siteId: null, quantity: 0})
    setState({createdAt: '', items: []})
  }
  
  const onAddItem = () => {
    if (state.items.length < 0) {
      setState({...state, items: [...state.items, fields]})
      setFields({id: null, fuel: null, site: null, siteId: null, quantity: 0})
    }
    else {
      const find = state.items.find(i => i.id === fields.id)
      if (find) toast.error('Ce carburant a déjà été ajouté.')
      else {
        const items = [...state.items]
        items.push(fields)
        setState({...state, items})
        setFields({id: null, fuel: null, site: null, siteId: null, quantity: 0})
      }
    }
  }
  
  const onRemoveItem = index => {
    const items = [...state.items]
    items.splice(index, 1)
    setState({...state, items})
  }
  
  const onSubmit = async () => {
    toggleShow()
    try {
      const send = await postNewFuelSupply(state)
      if (send?.data) {
        toast.success('Approvisionnement bien efféctué.')
        onReset()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Approvisionnement carburants'/>
      <PageLayout>
        <AppBreadcrumb title='Approvisionnement carburants'/>
        
        <Row>
          <Col md={8} className='mb-3'>
            <Card>
              <Card.Body>
                <FSupplyComp1
                  toggleShow={toggleShow}
                  show={show}
                  loader={isLoading}
                  state={state}
                  setState={setState}
                  onSubmit={onSubmit}
                  onRemoveItem={onRemoveItem}
                  onReset={onReset}/>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className='mb-3'>
            <Card>
              <Card.Body>
                <FSupplyComp2
                  loader={isLoading}
                  fields={fields}
                  setFields={setFields}
                  state={state}
                  setState={setState}
                  onAddItem={onAddItem}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(FuelSupply)
