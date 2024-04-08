import {useEffect, useState} from "react";
import ReactApexChart from 'react-apexcharts';
import {Card, Col, Spinner/*, Row, Tab, Tabs*/} from "react-bootstrap";
import toast from "react-hot-toast";
import {useGetSynthesisStatsQuery} from "../../model/stats.api.slice";

/*const tabs = [
  // {title: 'Journalier', event: 'daily'},
  // {title: 'Hebdomadaire', event: 'weekly'},
  {title: 'Ce Mois', event: 'monthly'},
  {title: 'Mois Dernier', event: 'last-month'},
  {title: 'Cette Année', event: 'year'},
]*/

const stats = {
  series: [{
    name: 'Carburant',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, {
    name: 'Dépenses',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, {
    name: 'Missions',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aôu', 'Sep', 'Oct', 'Nov', 'Déc']
    },
    /*tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },*/
  },
}

export default function SynthesisSection() {
  // const [key, setKey] = useState('monthly')
  const [state, setState] = useState(stats)
  
  const {data, isFetching, isError, error, refetch} = useGetSynthesisStatsQuery()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (data) {
      setState(s => ({...s, series: data}))
    }
  }, [data, isError])
  
  return (
    <Col md={8} className='mb-3'>
      <Card className='h-100'>
        <Card.Header className='bg-white py-4'>
          {/*<Row>
            <Col md={3} className='mb-2'><h4 className="mb-0">Synthèse</h4></Col>
            <Col className='mb-2 text-md-end'>
              <Tabs onSelect={k => setKey(k)} activeKey={key} variant='pills'>
                {tabs.length > 0 && tabs.map((t, i) =>
                  <Tab key={i} title={t.title} eventKey={t.event}/>)}
              </Tabs>
            </Col>
          </Row>*/}
          <h4 className="mb-0">
            {!isFetching &&
              <i
                className='bi bi-arrow-clockwise text-primary me-1'
                onClick={onRefresh}
                style={{ cursor: 'pointer' }}/>}
            
            {isFetching && <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
            Synthèse
          </h4>
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
