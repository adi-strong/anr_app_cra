import {Card, Col, Dropdown, Spinner} from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {useEffect, useState} from "react";
import {
  useGetThisMonthFinancesStatsQuery,
  useLazyGetFinancesStatsQuery,
  useLazyGetLastMonthFinancesStatsQuery
} from "../../model/stats.api.slice";
import toast from "react-hot-toast";

const items = [
  {title: 'Ce Mois', event: 'month'},
  {title: 'Mois Dernier', event: 'last_month'},
  {title: 'Cette Année', event: 'year'},
]

const filterKey = {
  month: 'Ce Mois',
  last_month: 'Mois Dernier',
  year: 'Cette Année',
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Missions', 'Autres'],
  datasets: [
    {
      label: '$',
      data: [0, 0,],
      backgroundColor: [
        'rgb(8,239,20)',
        'rgb(255, 99, 132)',
      ],
      borderColor: [
        'rgb(73,199,16)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function FinanceSection() {
  const [filter, setFilter] = useState('month')
  const [state, setState] = useState(data)
  
  const {data: monthly, isFetching, isError, error, refetch} = useGetThisMonthFinancesStatsQuery()
  
  const [getLastMonthFinancesStats, {data: lastMonth, isFetching: isSthFetch, isError: isSthError, error: sthError}]
    = useLazyGetLastMonthFinancesStatsQuery()
  
  const [getFinancesStats, {data: thisYear, isFetching: isLastFetch, isError: isLastError, error: lastError}]
    = useLazyGetFinancesStatsQuery()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
    
    if (isSthError) {
      if (sthError?.error) toast.error(sthError.error)
      if (sthError?.data && sthError.data['hydra:description']) toast.error(sthError.data['hydra:description'])
    }
    
    if (isLastError) {
      if (lastError?.error) toast.error(lastError.error)
      if (lastError?.data && lastError.data['hydra:description']) toast.error(lastError.data['hydra:description'])
    }
  }, [isError, isSthError, isLastError, error, sthError, lastError])
  
  const onRefresh = async () => {
    setFilter('month')
    await refetch()
  }
  
  useEffect(() => {
    if (monthly && filter === 'month') {
      setState(s => ({
        ...s,
        datasets: [{
          label: '$',
          data: [monthly.missions, monthly.others],
          backgroundColor: [
            'rgb(8,239,20)',
            'rgb(255, 99, 132)',
          ],
          borderColor: [
            'rgb(73,199,16)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }]
      }))
    }
    else if (lastMonth && filter === 'last_month') {
      setState(s => ({
        ...s,
        datasets: [{
          label: '$',
          data: [lastMonth.missions, lastMonth.others],
          backgroundColor: [
            'rgb(8,239,20)',
            'rgb(255, 99, 132)',
          ],
          borderColor: [
            'rgb(73,199,16)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }]
      }))
    }
    else if (thisYear && filter === 'year') {
      setState(s => ({
        ...s,
        datasets: [{
          label: '$',
          data: [thisYear.missions, thisYear.others],
          backgroundColor: [
            'rgb(8,239,20)',
            'rgb(255, 99, 132)',
          ],
          borderColor: [
            'rgb(73,199,16)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }]
      }))
    }
  }, [filter, monthly, lastMonth, thisYear])
  
  async function onFilterClick(event) {
    switch (event) {
      case 'year':
        await getFinancesStats()
        break
      case 'last_month':
        await getLastMonthFinancesStats()
        break
      default:
        onRefresh()
        break
    }
    
    setFilter(event)
  }
  
  return (
    <Col md={4} className='mb-3'>
      <Card className='h-100'>
        <Card.Body>
          <div className='d-flex align-items-center justify-content-between'>
            <h4>
              {!(isFetching || isSthFetch || isLastFetch) &&
                <i
                  className='bi bi-arrow-clockwise text-primary me-1'
                  onClick={onRefresh}
                  style={{ cursor: 'pointer' }}/>}
              
              {(isFetching || isSthFetch || isLastFetch) &&
                <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
              Dépenses
              <small><code className='text-secondary'> | {filterKey[filter]}</code></small>
            </h4>
            
            <Dropdown className='dropstart' children={
              <>
                <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                  <i className='bi bi-three-dots-vertical text-primary'/>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  {items.length > 0 && items.map((f, i) =>
                    <Dropdown.Item key={i} onClick={() => onFilterClick(f.event)}>
                      {f.title}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
              </>
            }/>
          </div>
          
          <Doughnut data={state} />
          
          <div className='mx-3'>
            <div className='text-success'>
              <i className='bi bi-currency-exchange'/> MISSIONS <hr className='mb-1 mt-1'/>
              <div className='text-end'>
                <div style={{ fontWeight: 900 }}>
                  {!isError && monthly && filter === 'month' && (
                    <>
                      {parseFloat(monthly.missions).toFixed(2)+' '}
                      {monthly?.currency?.symbol} ({monthly?.currency?.code})
                    </>
                  )}
                  {!isSthError && lastMonth && filter === 'last_month' && (
                    <>
                      {parseFloat(lastMonth.missions).toFixed(2)+' '}
                      {lastMonth?.currency?.symbol} ({lastMonth?.currency?.code})
                    </>
                  )}
                  {!isLastError && thisYear && filter === 'year' && (
                    <>
                      {parseFloat(thisYear.missions).toFixed(2)+' '}
                      {thisYear?.currency?.symbol} ({thisYear?.currency?.code})
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className='text-danger'>
              <i className='bi bi-currency-exchange'/> AUTRES <hr className='mb-1 mt-1'/>
              <div className='text-end' style={{ fontWeight: 900 }}>
                {!isError && monthly && filter === 'month' && (
                  <>
                    {parseFloat(monthly.others).toFixed(2)+' '}
                    {monthly?.currency?.symbol} ({monthly?.currency?.code})
                  </>
                )}
                {!isSthError && lastMonth && filter === 'last_month' && (
                  <>
                    {parseFloat(lastMonth.others).toFixed(2)+' '}
                    {lastMonth?.currency?.symbol} ({lastMonth?.currency?.code})
                  </>
                )}
                {!isLastError && thisYear && filter === 'year' && (
                  <>
                    {parseFloat(thisYear.others).toFixed(2)+' '}
                    {thisYear?.currency?.symbol} ({thisYear?.currency?.code})
                  </>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
