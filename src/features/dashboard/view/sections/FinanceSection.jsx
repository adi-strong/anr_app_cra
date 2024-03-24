import {Card, Col, Dropdown} from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {useState} from "react";

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
  labels: ['Caisse', 'Entrées', 'Dépenses'],
  datasets: [
    {
      label: '$',
      data: [12, 19, 3,],
      backgroundColor: [
        'rgb(8,239,20)',
        'rgb(255, 206, 86)',
        'rgb(255, 99, 132)',
      ],
      borderColor: [
        'rgb(73,199,16)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function FinanceSection() {
  const [filter, setFilter] = useState('month')
  const [state] = useState(data)
  
  function onFilterClick(event) {
    setFilter(event)
  }
  
  return (
    <Col md={4} className='mb-3'>
      <Card className='h-100'>
        <Card.Body>
          <div className='d-flex align-items-center justify-content-between'>
            <h4>
              Finances
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
              <i className='bi bi-currency-exchange'/> CAISSE <hr className='mb-1 mt-1'/>
              <div className='text-end'>
                <div style={{ fontWeight: 900 }}>$ 12.00</div>
                <div style={{ fontWeight: 900 }}>FC 9 826.00</div>
              </div>
            </div>
            
            <div className='text-warning'>
              <i className='bi bi-currency-exchange'/> ENTRÉES <hr className='mb-1 mt-1'/>
              <div className='text-end'>
                <div style={{ fontWeight: 900 }}>$ 12.00</div>
                <div style={{ fontWeight: 900 }}>FC 9 826.00</div>
              </div>
            </div>
            
            <div className='text-danger'>
              <i className='bi bi-currency-exchange'/> DÉPENSES <hr className='mb-1 mt-1'/>
              <div className='text-end'>
                <div style={{ fontWeight: 900 }}>$ 12.00</div>
                <div style={{ fontWeight: 900 }}>FC 9 826.00</div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
