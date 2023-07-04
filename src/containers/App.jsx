import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from "axios";
import Cookie from 'js-cookie';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import Stats from '../containers/Stats'
import { Container } from 'reactstrap';

import Users from '../containers/Users';
import UserForm from '../containers/UserForm';

import Collections from './Collections';
import CollectionForm from './CollectionForm';

import Admins from './Admins';
import AdminForm from './AdminForm';

import Brands from './Brands';
import BrandForm from './BrandForm';

import News from './News';
import NewsForm from './NewsForm';

import Events from './Events';
import EventForm from './EventForm';

import PrivacyPolicy from './PrivacyPolicy';
import PrivacyPolicyForm from './PrivacyPolicyForm';

import TermsService from './TermsService';
import TermsServiceForm from './TermsServiceForm';

import AboutForm from './AboutForm';
import FAQForm from './FAQForm';

import Sneakers from './Sneakers';
import SneakersForm from './SneakersForm';

import * as types from '../static/_types';
import {firebase} from "../backend/firebase"
import {getSignedInUser} from "../backend/services/authService";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      displayLoading: true,
      displayApp: false,
      displayMessage: 'Loading User Data...'
    }
  }

  async componentDidMount() {
    const { dispatch, history } = this.props;
    const token = Cookie.get('sneakerlog_access_token');


    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.props.dispatch({
          type: types.SET_USER_FROM_TOKEN,
          payload: user
        });
      }
    })

    if (token) {
      this.setState({ loading: false });
    } else {
      history.push('/login');
    }
  }

  render() {
      return (
      <div className="app">
        <Header/>
        <div className="app-body">
          <Sidebar {...this.props} user={this.state.user}/>
          <main className="main">
            <Breadcrumb/>
            <Container fluid>
              <Switch>
                  <Route exact={true} path='/' component={Stats}/>     
                  
                  <Route exact={true} path="/users" component={Users}/>
                  <Route exact={true} path='/users/user-form' component={UserForm}/>
                  <Route exact={true} path="/users/edit-user/:userId" component={UserForm}/>

                  <Route exact={true} path="/admin" component={Admins}/>
                  <Route exact={true} path="/admin/admin-form" component={AdminForm}/>
                  <Route exact={true} path="/admin/edit-admin/:adminId" component={AdminForm}/>

                  <Route exact={true} path="/brands" component={Brands}/>
                  <Route exact={true} path="/brands/brand-form" component={BrandForm}/>
                  <Route exact={true} path="/brands/edit-brand/:brandId" component={BrandForm}/>

                  <Route exact={true} path="/collection" component={Collections}/>
                  <Route exact={true} path="/collection/collection-form" component={CollectionForm}/>
                  <Route exact={true} path="/collection/edit-collection/:exerciseId" component={CollectionForm}/>

                  <Route exact={true} path="/news" component={News}/>
                  <Route exact={true} path="/news/news-form" component={NewsForm}/>
                  <Route exact={true} path="/news/edit-news/:newsId" component={NewsForm}/>

                  <Route exact={true} path="/events" component={Events}/>
                  <Route exact={true} path="/events/event-form" component={EventForm}/>
                  <Route exact={true} path="/events/edit-event/:eventId" component={EventForm}/>

                  <Route exact={true} path="/sneakers" component={Sneakers}/>
                  <Route exact={true} path="/sneakers/sneakers-form" component={SneakersForm}/>
                  <Route exact={true} path="/sneakers/edit-sneakers/:sneakersId" component={SneakersForm}/>
                  

                  <Route exact={true} path="/privacy-policy" component={PrivacyPolicyForm}/>
                  {/* <Route exact={true} path="/privacy-policy/privacy-policy-form" component={PrivacyPolicyForm}/> */}
                  {/* <Route exact={true} path="/privacy-policy/edit-privacy-policy/:privacyPolicyId" component={PrivacyPolicyForm}/> */}

                  <Route exact={true} path="/terms-service" component={TermsServiceForm}/>
                  {/* <Route exact={true} path="/terms-service/terms-service-form" component={TermsServiceForm}/> */}
                  {/* <Route exact={true} path="/terms-service/edit-terms-service/:eventId" component={TermsServiceForm}/> */}

                  <Route exact={true} path="/about" component={AboutForm}/>

                  <Route exact={true} path="/faq" component={FAQForm}/>
                  
                </Switch>
              </Container>
              </main>
            </div>
            <Footer />
          </div>
      );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(App));