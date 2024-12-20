import {ErrorBoundary} from "react-error-boundary";
import {AuthorizedNode, FallBackRender} from "../../index";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {onOpenSubMenu} from "../../../features/config/config.slice";
// import AsideMenuItem from "./AsideMenuItem";
import AsideMenuItem2 from "./AsideMenuItem2";

export default function AsideMenu() {
  const {menus} = useSelector(state => state.config)
  const {user: session} = useSelector((state) => state.auth)
  
  const {pathname} = useLocation()
  const dispatch = useDispatch()
  
  // const toggleMenu = menuKey => dispatch(onToggleMenu({ menuKey }))
  
  const toggleSubMenu = index => dispatch(onOpenSubMenu(index))
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <ul id='sideNavbar' className='navbar-nav flex-column'>
        {/*menus.length > 0 &&
          <AsideMenuItem
            items={menus}
            index={0}
            onClick={toggleMenu}
            menuKey={menus[0].key}/>*/}
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedNode userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            {menus.length > 0 &&
              <AsideMenuItem2
                pathname={pathname}
                items={menus}
                index={0}
                onClick={toggleSubMenu}
                menuKey={menus[0].key}/>}
          </AuthorizedNode>
        )}
        
        {/*menus.length > 0 &&
          <AsideMenuItem
            items={menus}
            index={1}
            onClick={toggleMenu}
            menuKey={menus[1].key}/>*/}
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedNode userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            {menus.length > 0 &&
              <AsideMenuItem2
                pathname={pathname}
                items={menus}
                index={1}
                onClick={toggleSubMenu}
                menuKey={menus[1].key}/>}
          </AuthorizedNode>
        )}
        
        {/*menus.length > 0 &&
          <AsideMenuItem
            items={menus}
            index={2}
            onClick={toggleMenu}
            menuKey={menus[2].key}/>*/}
        
        {menus.length > 0 &&
          <AsideMenuItem2
            pathname={pathname}
            items={menus}
            index={3}
            onClick={toggleSubMenu}
            menuKey={menus[3].key}/>}
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedNode userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            {menus.length > 0 &&
              <AsideMenuItem2
                pathname={pathname}
                items={menus}
                index={5}
                onClick={toggleSubMenu}
                menuKey={menus[5].key}/>}
          </AuthorizedNode>
        )}
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedNode userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            {menus.length > 0 &&
              <AsideMenuItem2
                pathname={pathname}
                items={menus}
                index={7}
                onClick={toggleSubMenu}
                menuKey={menus[7].key}/>}
          </AuthorizedNode>
        )}
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedNode userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            {menus.length > 0 &&
              <AsideMenuItem2
                pathname={pathname}
                items={menus}
                index={8}
                onClick={toggleSubMenu}
                menuKey={menus[8].key}/>}
          </AuthorizedNode>
        )}
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedNode userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            {menus.length > 0 &&
              <AsideMenuItem2
                pathname={pathname}
                items={menus}
                index={4}
                onClick={toggleSubMenu}
                menuKey={menus[4].key}/>}
          </AuthorizedNode>
        )}
      </ul>
    </ErrorBoundary>
  )
}
