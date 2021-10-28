import { BrowserRouter, Route, Redirect, Switch  } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Searcher from './components/Searcher';
import e404 from './components/404';
const PrivateRoute = ({ component: Component, ...rest }) => 
(  
  <Route {...rest} render={props => 
  (
    localStorage.getItem('token') ? <Component {...props} /> : <Redirect to={{pathname: '/login'}}/>
  )}/>
);

function App() {


  return (
<>

    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/" component={Home} exact />
        <PrivateRoute path="/home" component={Home}  />
        <PrivateRoute path="/searcher" component={Searcher}  />
        <PrivateRoute path="*" component={e404} />

      </Switch>      
    </BrowserRouter>

    </>
  );
}



export default App;
