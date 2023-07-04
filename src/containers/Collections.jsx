import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import Swal from 'sweetalert2';
const token = Cookie.get('sneakerlog_access_token');

export default class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Collection...'
    }
  }

  componentWillMount() {
    this.fetchCollection();
  }

  fetchCollection = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/collection`)
    .then(response => {
      this.setState({
        collections: response.data.data,
        loading: false,
        responseMessage: 'No Collection Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Collection Found...'
      })
    })
  }
  
  deleteCollection(collectionId, index) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
  }).then((result) => {
    if (result.value) {
      axios.delete(`${API_END_POINT}/api/v1/collection/${collectionId}`)
        .then(response => {
          const collections = this.state.collections.slice();
          collections.splice(index, 1);
          this.setState({ collections });
          window.alert(response.data.message);
        });
    }
  })}

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
    this.setState({loading: true, collections: [], responseMessage: 'Loading Collection...'})
    // if(q === "") {
    //   this.fetchCollection();
    // } else {
      axios.get(`${API_END_POINT}/api/items/collection/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          collections: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Collection Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Collection Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, collections, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Collections</h3>
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
                      this.fetchCollection();
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
              <Link to="/collection/collection-form">
                <button type="button" className="btn btn-success">Add New Collection</button>
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
                {this.state.collections && this.state.collections.length >= 1 ?
                this.state.collections.map((collection, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{collection.name}</td>
                  <td>{collection.program_name}</td>
                  <td>{collection.day_name}</td>
                  <td>
                    <Link to={`/collection/edit-collection/${collection.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteCollection(collection.id, index)}></span>
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
