import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';

//integrating redux with react
import { Provider } from 'react-redux';
import store from './store';

const App = () => (
    <Provider store={store}>
        <Router>
            <Fragment>
                <Navbar />
                <Route exact path='/' component={Landing} />
                <section className='container'>
                    <Alert />
                    <Switch>
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                    </Switch>
                </section>
            </Fragment>
        </Router>
    </Provider>
);

export default App;
