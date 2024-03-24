import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import {Link} from "react-router-dom";
import logo from '../../../assets/images/logo_2.png';
import AsideMenu from "./AsideMenu";

export default function Aside() {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <nav className='navbar-vertical navbar'>
        <div className='slimScrollDiv'>
          <div className='nav-scroller'>
            <Link className="navbar-brand text-light fw-bold" to='/app/dashboard'>
              <img src={logo} className='me-1' alt=''/>
              Clinic OFFICE
            </Link>
            
            <AsideMenu/>
          </div>
          
          {/* toggle menu button */}
        </div>
      </nav>
    </ErrorBoundary>
  )
}
