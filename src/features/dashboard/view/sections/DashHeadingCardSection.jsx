import {Card, Col, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

export default function DashHeadingCardSection({title, onRefresh, total, nb, show, isVisible, icon, wording, md = 12, loader, to='#!'}) {
  return (
    <Col md={md} className='col-12 mt-6'>
      <Card style={{ height: 175 }}>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div>
              <h4 className="mb-0">
                {onRefresh && (
                  <>
                    {!loader &&
                      <i
                        className='bi bi-arrow-clockwise me-1 text-primary'
                        onClick={onRefresh}
                        style={{ cursor: 'pointer' }}/>}
                  </>
                )}
                {title}
              </h4>
            </div>
            
            <div className='icon-shape icon-md bg-light-primary text-primary rounded-2'>
              <i className={`${icon} fs-4`}/>
            </div>
          </div>
          
          <div>
            <h1 className="fw-bold">{total}</h1>
            
            <p className="mb-0 d-flex justify-content-between">
              {show &&
                <span>
                  <span className="text-dark me-2">{nb}</span>{wording}
                </span>}
              
              <span/>
              
              {isVisible && to &&
                <Link to={to}><i className='bi bi-arrow-90deg-right'/> plus</Link>}
            </p>
            {loader && <Spinner animation='grow' size='sm' className='text-primary'/>}
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

DashHeadingCardSection.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.any.isRequired,
  icon: PropTypes.string,
  wording: PropTypes.string,
  nb: PropTypes.number,
  show: PropTypes.bool,
  isVisible: PropTypes.bool,
  loader: PropTypes.bool,
}
