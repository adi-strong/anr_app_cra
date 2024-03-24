import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import AppSearch from "./AppSearch";
import HeaderMenu from "./HeaderMenu";
import PropTypes from "prop-types";

export default function Header({toggleSidebar}) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <div className='header @@classList'>
        <nav className='navbar-classic navbar navbar-expand-lg'>
          <span id='nav-toggle' onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu nav-icon me-2 icon-xs">
              <line x1={3} y1={12} x2={21} y2={12}/>
              <line x1={3} y1={6} x2={21} y2={6}/>
              <line x1={3} y1={18} x2={21} y2={18}/>
            </svg>
          </span>
          
          <AppSearch/>
          <HeaderMenu/>
        </nav>
      </div>
    </ErrorBoundary>
  )
}

Header.propTypes = {toggleSidebar: PropTypes.func.isRequired}
