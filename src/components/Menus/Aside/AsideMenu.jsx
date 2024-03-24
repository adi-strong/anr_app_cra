import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {onOpenSubMenu, onToggleMenu} from "../../../features/config/config.slice";
import AsideMenuItem from "./AsideMenuItem";
import AsideMenuItem2 from "./AsideMenuItem2";

export default function AsideMenu() {
  const {menus} = useSelector(state => state.config)
  
  const {pathname} = useLocation()
  const dispatch = useDispatch()
  
  const toggleMenu = menuKey => dispatch(onToggleMenu({ menuKey }))
  
  const toggleSubMenu = index => dispatch(onOpenSubMenu(index))
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <ul id='sideNavbar' className='navbar-nav flex-column'>
        {menus.length > 0 &&
          <AsideMenuItem
            items={menus}
            index={0}
            onClick={toggleMenu}
            menuKey={menus[0].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem
            items={menus}
            index={1}
            onClick={toggleMenu}
            menuKey={menus[1].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem
            items={menus}
            index={2}
            onClick={toggleMenu}
            menuKey={menus[2].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem2
            pathname={pathname}
            items={menus}
            index={3}
            onClick={toggleSubMenu}
            menuKey={menus[3].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem2
            pathname={pathname}
            items={menus}
            index={5}
            onClick={toggleSubMenu}
            menuKey={menus[5].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem2
            pathname={pathname}
            items={menus}
            index={7}
            onClick={toggleSubMenu}
            menuKey={menus[7].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem2
            pathname={pathname}
            items={menus}
            index={8}
            onClick={toggleSubMenu}
            menuKey={menus[8].key}/>}
        
        {menus.length > 0 &&
          <AsideMenuItem2
            pathname={pathname}
            items={menus}
            index={4}
            onClick={toggleSubMenu}
            menuKey={menus[4].key}/>}
      </ul>
    </ErrorBoundary>
  )
}
