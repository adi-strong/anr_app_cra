import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Table} from "react-bootstrap";
import {useMemo} from "react";

const style = { fontSize: '0.6rem' }

const thItems = [
  {label: 'Agent'},
  {label: 'S. de base', className: 'text-end'},
  {label: 'P. de risque', className: 'text-end'},
  {label: 'P. de fonction', className: 'text-end'},
  {label: 'Net à payer', className: 'text-end'},
]

const Item = ({a, state, onRemove}) => {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle p-1' style={style}>{a?.agent ? a.agent?.label : '-'}</td>
        <td className='align-middle text-end p-1' style={style}>
          {a?.baseAmount ? parseFloat(a.baseAmount).toFixed(2) : '-'}
        </td>
        <td className='align-middle text-end p-1' style={style}>
          {a?.riskPremiumAmount ? parseFloat(a.riskPremiumAmount).toFixed(2) : '-'}
        </td>
        <td className='align-middle text-end p-1' style={style}>
          {a?.functionBonusAmount ? parseFloat(a.functionBonusAmount).toFixed(2) : '-'}
        </td>
        <td className='align-middle text-end p-1' style={style}>
          {a?.total ? parseFloat(a.total).toFixed(2)+' ' : '-'}
          {state?.currency && state.currency?.symbol}
        </td>
        
        <td className='align-middle text-end p-1' style={style}>
          <i className='bi bi-trash-fill text-danger' style={{ cursor: 'pointer' }} onClick={onRemove}/>
        </td>
      </tr>
    </ErrorBoundary>
  )
}

export default function MainSalaryForm({state, setState, onReset, onRemoveItem, loader = false}) {
  let total
  
  total = useMemo(() => {
    let sum = 0
    if (state?.items && state.items?.length > 0) {
      const items = [...state.items]
      for (const key in items) {
        const item = items[key]
        sum += (item?.baseAmount + item?.riskPremiumAmount + item?.functionBonusAmount)
      }
    }
    
    return sum
  }, [state])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <hr/>
      <Table responsive striped>
        <thead className='bg-primary'>
        <tr>
          {thItems.length && thItems.map(t =>
            <th key={t.label} className={`p-1 align-middle text-white ${t?.className}`} style={style}>
              {t.label}
            </th>)}
          <th className='p-1 align-middle text-end'>
            <i className='bi bi-trash-fill text-white' style={{ cursor: 'pointer' }} onClick={onReset}/>
          </th>
        </tr>
        </thead>
        
        <tbody>
        {state?.items && state.items?.length > 0 && state.items?.map((a, i) =>
          <Item key={i} a={a} state={state} onRemove={() => onRemoveItem(i)}/>)}
        </tbody>
        
        <tfoot>
        <tr>
          <td style={{ fontSize: '0.6rem', fontWeight: 800 }} className='align-middle p-1' colSpan={4}>TOTAL</td>
          <td style={{ fontSize: '0.6rem', fontWeight: 800 }} className='align-middle p-1 text-end'>
            {parseFloat(total).toFixed(2)+' '}
            {state?.currency && state.currency?.symbol}
          </td>
          <td className='bg-light'/>
        </tr>
        </tfoot>
      </Table>
    </ErrorBoundary>
  )
}
