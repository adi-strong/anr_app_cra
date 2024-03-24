import {Card, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

export default function DashHeadingCardSection({title, total, nb, show, isVisible, icon, wording}) {
  return (
    <Col xl={3} lg={6} md={12} className='col-12 mt-6'>
      <Card style={{ height: 175 }}>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div>
              <h4 className="mb-0">{title}</h4>
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
              
              {isVisible &&
                <Link to='#!'><i className='bi bi-arrow-90deg-right'/> plus</Link>}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

DashHeadingCardSection.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  icon: PropTypes.string,
  wording: PropTypes.string,
  nb: PropTypes.number,
  show: PropTypes.bool,
  isVisible: PropTypes.bool,
}
