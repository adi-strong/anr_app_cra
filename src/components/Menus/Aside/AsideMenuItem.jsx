import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

export default function AsideMenuItem({items, menuKey, onClick, index}) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <li
        className='nav-item'>
        <Link
          to={items[index].to}
          className={`nav-link has-arrow ${items[index]?.isActive
            ? 'active' : ''}`} onClick={() => onClick(menuKey)}>
          <i className={`nav-icon icon-xs me-2 ${items[index].icon}`}/>
          {items[index].label}
        </Link>
      </li>
    </ErrorBoundary>
  )
}

AsideMenuItem.propTypes = {
  items: PropTypes.array.isRequired,
  menuKey: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
}
