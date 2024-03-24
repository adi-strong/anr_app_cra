import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import ShowInvoiceHeader from "./showInvoiceHeader";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {Button, Table} from "react-bootstrap";

const fStyle = { fontSize: '0.7rem' }
const fStyle2 = { fontSize: '0.6rem' }

export default function ShowInvoiceDetails() {
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='text-center mt-2'>
        <Button disabled={false} onClick={handlePrint}>
          <i className='bi bi-printer'/> Imprimer
        </Button>
      </div>
      
      <div className='container-fluid' ref={printRef}>
        <ShowInvoiceHeader title='DÉTAILS FACTURE PATIENT'/>
        
        {/* Hospitalization ***************************************************************************/}
        <Table responsive bordered className='text-dark' style={{ fontSize: '0.7rem' }}>
          <thead>
          <tr><th style={fStyle} className='p-1 text-dark' colSpan={3}>1. FRAIS DE SÉJOUR  </th></tr>
          <tr>
            <th style={fStyle2} className='p-1 fw-bold text-dark'>1.1. FRAIS DE SÉJOUR HOSPITALISATION</th>
            <th style={fStyle2} className='p-1 text-end text-dark'>NBRE JOURS</th>
            <th style={fStyle2} className='p-1 text-end text-dark'>PRIX ($)</th>
          </tr>
          </thead>
          
          <tbody>
          <tr>
            <td style={fStyle} className='p-1'>
              Service du ...
            </td>
            <td style={fStyle} className='p-1 text-end'>
              4
            </td>
            <td style={fStyle} className='p-1 text-end'>
              5
            </td>
          </tr>
          </tbody>
          
          <tfoot>
          <tr>
            <th style={fStyle2} className='fw-bold p-1 text-primary' colSpan={2}>
              Sous-total 1 - Frais de séjour
            </th>
            <th style={fStyle2} className='fw-bold p-1 text-end text-primary'>
              178 $
            </th>
          </tr>
          </tfoot>
        </Table>
        {/* End Hospitalization ***********************************************************************/}
        
        {/* Analyses **********************************************************************************/}
        <Table responsive bordered className='text-dark mt-5' style={{ fontSize: '0.7rem' }}>
          <thead>
          <tr><th style={fStyle} className='p-1 text-dark' colSpan={2}>2. FRAIS D'ANALYSES</th></tr>
          <tr>
            <th style={fStyle2} className='p-1 fw-bold text-dark'>2.1. BIOLOGIE CLINIQUE</th>
            <th style={fStyle2} className='p-1 text-end text-dark'>PRIX ($)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style={fStyle} className='p-1'>
              Interprétation ...
            </td>
            <td style={fStyle} className='p-1 text-end'>
              10 $
            </td>
          </tr>
          </tbody>
          
          <thead>
          <tr>
            <th style={fStyle2} className='p-1 fw-bold text-dark'>2.2. IMAGÉRIE MÉDICALE</th>
            <th style={fStyle2} className='p-1 text-end text-dark'>PRIX ($)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style={fStyle} className='p-1'>
              Interprétation ...
            </td>
            <td style={fStyle} className='p-1 text-end'>
              10 $
            </td>
          </tr>
          </tbody>
          
          <tfoot>
          <tr>
            <th style={fStyle2} className='fw-bold p-1 text-primary'>
              Sous-total 1 - Frais de séjour
            </th>
            <th style={fStyle2} className='fw-bold p-1 text-end text-primary'>
              178 $
            </th>
          </tr>
          </tfoot>
        </Table>
        {/* End Analyses ******************************************************************************/}
      </div>
    </ErrorBoundary>
  )
}
