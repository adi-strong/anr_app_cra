import {HashRouter as Router, Route, Routes} from "react-router-dom";
import {LoginLayout, ProtectedLayout} from "../layouts";
import routes from "./routes";
import {Suspense} from "react";
import {Pending} from "../components";
import Error404 from "../components/Error404";

export default function Contents() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LoginLayout/>}>
          {routes[0].routes.map((r, i) =>
            <Route
              key={i}
              exact
              index={r.index}
              path={r.path}
              element={<Suspense fallback={<Pending/>}>{r.element}</Suspense>} />)}
        </Route>
        
        <Route exact path='/app/' element={<ProtectedLayout/>}>
          {routes[1].routes.map((r, i) =>
            <Route
              key={i}
              exact
              index={r.index}
              path={r.path}
              element={<Suspense fallback={<Pending/>}>{r.element}</Suspense>} />)}
        </Route>
        
        <Route path='*' element={<Error404/>}/>
      </Routes>
    </Router>
  )
}
