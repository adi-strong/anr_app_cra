import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Collapse} from "react-bootstrap";

export default function AsideMenuItem2({items, onClick, index, pathname}) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <li
        className='nav-item'>
        <Link
          to={items[index].to}
          data-bs-toggle='collapse'
          className={`nav-link has-arrow ${items[index]?.isOpen
            ? 'active' : 'collapsed'}`} onClick={() => onClick(index)}>
          <i className={`nav-icon icon-xs me-2 ${items[index].icon}`}/>
          {items[index].label}
        </Link>
        
        <Collapse in={items[index]?.isOpen} children={
          <ul className='nav'>
            {items[index].subItems?.length > 0 && items[index].subItems.map((s, j) =>
              <li key={j} className='nav-item'>
                <Link to={s.to} className={`nav-link ${pathname === s.to && 'active'}`}>
                  {s.label}
                </Link>
              </li>)}
          </ul>
        }/>
      </li>
    </ErrorBoundary>
  )
}

AsideMenuItem2.propTypes = {
  items: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
}
