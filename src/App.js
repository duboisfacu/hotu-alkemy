import { BrowserRouter as Router, Route, Redirect, Switch  } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Searcher from './components/Searcher';
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

    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/" component={Home} exact />
        <PrivateRoute path="/home" component={Home}  />
        <PrivateRoute path="/searcher" component={Searcher}  />
      </Switch>      
    </Router>
    
    </>
  );
}



export default App;
