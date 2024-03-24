import {Card, Col, Dropdown} from "react-bootstrap";
import {useState} from "react";
import ReactApexChart from "react-apexcharts";

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

const data = {
  series: [44, 55, 67],
  options: {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 249
            }
          }
        }
      }
    },
    labels: ['En Cours', 'Traité(s)', 'Abandonné(s)'],
  }
}

export default function ConsultationsPercentSection() {
  const [filter, setFilter] = useState('month')
  const [state] = useState(data)
  
  function onFilterClick(event) {
    setFilter(event)
  }
  
  return (
    <Col md={4} className='mt-2 mb-3'>
      <Card className='h-100'>
        <Card.Body>
          <div className='d-flex align-items-center justify-content-between'>
            <h4>
              Dossiers
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
          
          <div className='mb-4'>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type='radialBar'
              height={350} />
          </div>
          
          <div className='d-flex align-items-center justify-content-around'>
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check-circle icon-sm text-success">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              
              <h1 className="mt-3 mb-1 fw-bold">76</h1>
              <p>Traité(s)</p>
            </div>
            
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-trending-up icon-sm text-warning">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              
              <h1 className="mt-3  mb-1 fw-bold">32%</h1>
              <p>En Cours</p>
            </div>
            
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-trending-down icon-sm text-danger">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>
              
              <h1 className="mt-3  mb-1 fw-bold">13%</h1>
              <p>Abandonné(s)</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
