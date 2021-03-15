import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
//integrating redux with react
import { Provider } from 'react-redux';
import store from './store';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path='/' component={Landing} />
                    <section className='container'>
                        <Alert />
                        <Switch>
                            <Route
                                exact
                                path='/register'
                                component={Register}
                            />
                            <Route exact path='/login' component={Login} />
                            <Route
                                exact
                                path='/profiles'
                                component={Profiles}
                            />
                            <Route
                                exact
                                path='/profile/:id'
                                component={Profile}
                            />
                            <PrivateRoute
                                exact
                                path='/dashboard'
                                component={Dashboard}
                            />
                            <PrivateRoute
                                exact
                                path='/create-profile'
                                component={CreateProfile}
                            />
                            <PrivateRoute
                                exact
                                path='/edit-profile'
                                component={EditProfile}
                            />
                            <PrivateRoute
                                exact
                                path='/add-experience'
                                component={AddExperience}
                            />
                            <PrivateRoute
                                exact
                                path='/add-education'
                                component={AddEducation}
                            />
                            <PrivateRoute
                                exact
                                path='/posts'
                                component={Posts}
                            />
                            <PrivateRoute
                                exact
                                path='/posts/:id'
                                component={Post}
                            />
                        </Switch>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
