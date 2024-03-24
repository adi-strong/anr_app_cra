import {useState} from "react";
import ReactApexChart from 'react-apexcharts';
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";

const tabs = [
  {title: 'Journalier', event: 'daily'},
  {title: 'Hebdomadaire', event: 'weekly'},
  {title: 'Ce Mois', event: 'monthly'},
  {title: 'Mois Dernier', event: 'last-month'},
  {title: 'Cette Année', event: 'year'},
]

export default function SynthesisSection() {
  const [key, setKey] = useState('daily')
  const [state] = useState({
    series: [{
      name: 'Fiches',
      data: [31, 40, 28, 51, 42, 109, 100]
    }, {
      name: 'Revenus',
      data: [5, 16, 22, 16, 17, 26, 1]
    }, {
      name: 'Patients',
      data: [11, 32, 45, 32, 34, 52, 41]
    }],
    options: {
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: ['00:00', '06:00', '09:00', '15:00', '18:00', '21:00', '23:00']
      },
      /*tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },*/
    },
  })
  
  return (
    <Col md={8} className='mb-3'>
      <Card className='h-100'>
        <Card.Header className='bg-white py-4'>
          <Row>
            <Col md={3} className='mb-2'><h4 className="mb-0">Synthèse</h4></Col>
            <Col className='mb-2 text-md-end'>
              <Tabs onSelect={k => setKey(k)} activeKey={key} variant='pills'>
                {tabs.length > 0 && tabs.map((t, i) =>
                  <Tab key={i} title={t.title} eventKey={t.event}/>)}
              </Tabs>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <ReactApexChart
            options={state.options}
            series={state.series}
            type='area'/>
        </Card.Body>
      </Card>
    </Col>
  )
}
