import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');

export default class TermsService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      termsService: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Terms of Service...'
    }
  }

  componentWillMount() {
    this.fetchTermsService();
  }

  fetchTermsService = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/termsService`)
    .then(response => {
      this.setState({
        termsService: response.data.data,
        loading: false,
        responseMessage: 'No Terms of Service Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Terms of Service Found...'
      })
    })
  }
  
  deleteTermsService(termsServiceId, index) {
    if(confirm("Are you sure you want to delete this termsService?")) {
      axios.delete(`${API_END_POINT}/api/v1/termsService/${termsServiceId}`)
        .then(response => {
          const termsService = this.state.termsService.slice();
          termsService.splice(index, 1);
          this.setState({ termsService });
          window.alert(response.data.message);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, termsService: [], responseMessage: 'Loading TermsService...'})
    // if(q === "") {
    //   this.fetchTermsService();
    // } else {
      axios.get(`${API_END_POINT}/api/items/termsService/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          termsService: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Terms of Service Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Terms of Service Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, termsService, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Terms Service</h3>
            </div>
            <div  className="col-sm-4">
              {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchTermsService();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
            </div>

          <div className="col-sm-4 pull-right mobile-space">
              <Link to="/terms-service/terms-service-form">
                <button type="button" className="btn btn-success">Add New Terms Service</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {this.state.termsService && this.state.termsService.length >= 1 ?
                this.state.termsService.map((termsService, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{termsService.name}</td>
                  <td>{termsService.program_name}</td>
                  <td>{termsService.day_name}</td>
                  <td>
                    <Link to={`/terms-service/edit-terms-service/${termsService.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteTermsService(termsService.id, index)}></span>
                  </td>
                </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
