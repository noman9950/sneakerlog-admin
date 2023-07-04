import React, { Component } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    axios.defaults.headers.common['Authorization'] = '';
    if (process.env.NODE_ENV === 'production') {
      Cookie.remove('sneakerlog_access_token')
    }
    else {
      Cookie.remove('sneakerlog_access_token');
    }
    //this.props.history.push("/login");
    window.location.href = ("/login");
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default Logout;
