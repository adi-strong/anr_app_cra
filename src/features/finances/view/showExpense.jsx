import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading, QRCodeComponent} from "../../../components";
import {memo, useEffect, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link, useParams} from "react-router-dom";
import {Button, Card, Col, Row, Spinner, Table} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";
import logo from "../../../assets/images/background/logo.png";
import {useGetUniqueExpenseQuery} from "../model/expenses.api.slice";
import toast from "react-hot-toast";
import {RepeatableTableRowsLoader} from "../../../loaders";
import moment from "moment";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const style = {fontSize: '0.7rem'}

const uStyle2 = { borderBottom: '2px solid #0909b0' }

const ShowExpense = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector(state => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  const {id} = useParams()
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueExpenseQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  let qrCodeValue
  qrCodeValue = useMemo(() => {
    let str = ""
    if (session) {
      str += "NOM : " + session?.fullName + "\n"
      str += "GRADE : " + session?.grade ? session.grade : ''
    }
    
    return str
  }, [session])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={'Dépense n°' + id}/>
      <PageLayout>
        <AppBreadcrumb title={`Bon de sorties n°${id}`}/>
        
        <div className='d-flex justify-content-between'>
          <div>
            <Button disabled={isFetching} variant='link' onClick={onRefresh}>
              {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
              {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
              Actualiser
            </Button>
            
            <Link to='/app/expenses' className='mx-1'>
              <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
            </Link>
          </div>
          
          <Button disabled={isFetching} variant='info' className='text-light' onClick={handlePrint}>
            <i className='bi bi-printer-fill'/> Imprimer
          </Button>
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <div className='container-fluid' ref={printRef}>
              <div className='mt-5 pt-10 px-10 pe-10 mb-3' style={uStyle2}>
                <Row>
                  <Col sm={6} className='mb-3'>
                    <img src={logo} className='rounded-circle' width={80} height={80} alt=''/>
                  </Col>
                  
                  <Col sm={6} className='mb-3 text-end text-dark'>
                    N° 1 | le{' '}
                    {!(isError && isLoading) && data && data?.releasedAt && moment(data.releasedAt).format('ll')}
                  </Col>
                </Row>
                
                <h2 style={nStyle} className='text-center'>
                  AGENCE NATIONALE DE RENSEIGNEMENTS
                </h2>
                <h6 className='text-center'>rue Philippe 49 731 Dumas-sur-Lebrun</h6>
              </div>
              
              <div className='mt-5 px-10 pe-10 mb-3 text-center'>
                <div className='mt-8 text-start'>
                  <Card.Title className='mb-6'>
                    <span className="fw-bold">Objet :</span> <br/>
                    {!(isError && isLoading) && data && data.object.toUpperCase()}
                  </Card.Title>
                  
                  <Card.Title>
                    <span className="fw-bold">Bénéficiaire</span> : <br/>
                    {!(isError && isLoading) && data && data.bearer.toUpperCase()}
                  </Card.Title>
                </div>
                
                <h4 className='card-title fw-bold'>BON DE DÉPENSES</h4>
              </div>
              
              <div className='mt-5 mb-3'>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th className="text-center align-middle p-1" style={style}>DÉSIGNATION</th>
                    <th className="text-center align-middle p-1" style={style}>NOMBRE</th>
                    <th className="text-end align-middle p-1" style={style}>
                      MONTANT{' '}
                      {!(isError && isLoading) && data && data?.currency && <>({data.currency?.symbol})</>}
                    </th>
                  </tr>
                  </thead>
                  
                  <tbody>
                  {!(isError && isLoading) && data && data?.operations && data.operations?.length > 0 &&
                    data.operations?.map((o, i) =>
                      <tr key={i}>
                        <td className='align-middle p-1 text-center' style={style}>{o?.type && o.type?.label}</td>
                        <td className='align-middle p-1 text-center' style={style}>{o?.qty && o.qty}</td>
                        <td className='align-middle p-1 text-end' style={style}>
                          {o?.amount && o.amount}
                        </td>
                      </tr>)}
                  </tbody>
                  
                  <tfoot>
                  <tr>
                    <td className='align-middle p-1' style={{ fontSize: '0.7rem', fontWeight: 800 }} colSpan={2}>
                      TOTAL
                    </td>
                    <td className='align-middle p-1 text-end' style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                      {data?.total+' '}
                      {data?.currency && data.currency?.symbol}
                    </td>
                  </tr>
                  </tfoot>
                </Table>
                
                {isLoading && <RepeatableTableRowsLoader/>}
              </div>
              
              <Row className='mt-5 mb-3'>
                <Col sm={6}>
                  {session &&
                    <QRCodeComponent value={qrCodeValue}/>}
                </Col>
                
                <Col sm={6} className='text-end'>
                  <div className='w-30 float-end text-dark' style={{ borderBottom: 'solid 1px #000' }}>
                    <span>SIGNATURE</span>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowExpense)
