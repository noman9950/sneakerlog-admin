import React from 'react';
import { Link } from 'react-router-dom';

import {getBrands} from "../backend/services/brandService"
import {getEvents} from "../backend/services/eventService"
import {getUsers} from "../backend/services/usersService"
import {getSneakersReleaseDates} from "../backend/services/sneakerReleaseService"

// import {Pagination} from 'react-bootstrap';
// import LineChart from '../components/LineChart'
// import PieChart from '../components/PieChart'
// import BarChart from '../components/BarChart'
// import Doughnut from '../components/Doughnut'

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      events: [],
      users: [],
      releaseDates: []
    }
  }

  componentWillMount() {
      getUsers()
      .then(response => {
        this.setState({
          users: response,
        })
      })
      getBrands()
      .then(response => {
        this.setState({
          brands: response,
        })
      })
      getEvents()
      .then(response => {
        this.setState({
          events: response,
        })
      })
      getSneakersReleaseDates()
      .then(response => {
        this.setState({
          releaseDates: response,
        })
      })
  }

  render() {
    const { users, brands, events, releaseDates } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4 pull-right mobile-space">
            </div>
          </div>
          <div className="text-center space-2">
          </div>
            <div className = 'row space-1'>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Users</h3>
                <h5>{users.length ? users.length : "Fetching users..."}</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Brands</h3>
                <h5>{brands.length ? brands.length : "Fetching brands..."}</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total News Articles</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Events</h3>
                <h5>{events.length ? events.length : "Fetching events..."}</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Products</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Sneaker Releases</h3>
                <h5>{releaseDates.length ? releaseDates.length : "Fetching elease dates..."}</h5>
              </div>
            </div>
        </div>
      </div>
    );
  }
}
