import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import {getBrands, deleteBrand} from "../backend/services/brandService";
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";

import {API_END_POINT} from '../config';
import Cookie from 'js-cookie';
import {deleteMultiple} from "../backend/services/usersService";

const token = Cookie.get('sneakerlog_access_token');

export default class Brand extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            brands: [],
            activePage: 0,
            pages: 0,
            perPage: 20,
            q: '',
            loading: true,
            responseMessage: 'Loading Brands...',
            showSnackBar: false,
            snackBarMessage: "",
            snackBarVariant: "success"
        }
    }

    componentWillMount() {
        this.fetchBrand();
    }

    fetchBrand = () => {
        this.setState({loading: true})
        getBrands()
            .then(response => {
                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    return r;
                })
                this.setState({
                    brands: response,
                    loading: false,
                    pages: Math.ceil(response.length/this.state.perPage),
                    activePage:1,
                    responseMessage: 'No Brands Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Brands Found...'
                })
            })
    }
    fetchBrandPlus = (a) => {
        this.setState({loading: true})
        getBrands()
            .then(response => {
                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    return r;
                })
                this.setState({
                    brands: response,
                    loading: false,
                    pages: Math.ceil(response.length/this.state.perPage),
                    activePage:a+1,
                    responseMessage: 'No Brands Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Brands Found...'
                })
            })
    }
    fetchBrandMinus = (a) => {
        this.setState({loading: true})
        getBrands()
            .then(response => {
                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    return r;
                })
                this.setState({
                    brands: response,
                    loading: false,
                    pages: Math.ceil(response.length/this.state.perPage),
                    activePage:a-1,
                    responseMessage: 'No Brands Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Brands Found...'
                })
            })
    }
    deleteBrand(brandId, index) {
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
                deleteBrand(brandId)
                    .then(response => {
                        const brands = this.state.brands.slice();
                        brands.splice(index, 1);
                        this.setState({
                            brands,
                            showSnackBar: true,
                            snackBarMessage: "Brand deleted successfully",
                            snackBarVariant: "success",
                        });
                    })
                    .catch(() => {
                        this.setState({
                            showSnackBar: true,
                            snackBarMessage: "Error deleting brand",
                            snackBarVariant: "error",
                        });
                    })
            }
        })
    }

    handleSelect(page) {
        const activePage = this.state.activePage;
        if (page !== activePage) {
            this.setState({activePage: page})
        }
    }

    handleSearch() {
        const {q} = this.state;
        if (q.length) {
            this.setState({loading: true, brands: [], responseMessage: 'Loading Brand...'})
            // if(q === "") {
            //   this.fetchBrand();
            // } else {
            axios.get(`${API_END_POINT}/api/items/brand/search`, {
                params: {"searchWord": this.state.q},
                headers: {"auth-token": token}
            })
                .then((response) => {
                    this.setState({
                        brands: response.data.searchedItems,
                        loading: false,
                        responseMessage: 'No Brands Found...'
                    })
                })
                .catch(() => {
                    this.setState({
                        loading: false,
                        responseMessage: 'No Brands Found...'
                    })
                })
        }
    }

    closeSnackBar = () => {
        this.setState({showSnackBar: false})
    }

    handleSelectBrand = (index) => {
        const brandList = this.state.brands;
        brandList[index].checked = !brandList[index].checked;
        this.setState({brands: brandList});
    }

    handleDeleteBrands = async (e) => {
        const brandList = this.state.brands;
        const brandsToDelete = (brandList).filter((brand) => brand.checked);
        this.setState({loading: true, responseMessage: "Deleting brands", brands: []})
        await deleteMultiple(brandsToDelete,"Brands");
        const filteredBrands = (brandList).filter((brand) => !brand.checked).map((brand,index)=>{
            brand.index=index+1;
            return brand;
        });
        this.setState({loading: false, brands: filteredBrands,responseMessage: "",
            pages: Math.ceil(filteredBrands.length/this.state.perPage),
        });

    }

    onHandleSearch = (type) => {
        let searchBy = this.state.searchBy;
        if (searchBy) {
            if (searchBy.label === type) {
                this.setState({searchBy: {label: type, orderBy: searchBy.orderBy === "asc" ? "desc" : "asc"},activePage:1});
            } else {
                this.setState({searchBy: {label: type, orderBy: "desc"},activePage:1});
            }
        } else {
            this.setState({searchBy: {label: type, orderBy: "desc"},activePage:1});

        }
    }


    render() {
        const {
            loading, responseMessage,
            showSnackBar,
            snackBarMessage,
            snackBarVariant,
            searchBy, activePage, perPage
        } = this.state;

        let brands = JSON.parse(JSON.stringify(this.state.brands));
        const page = activePage - 1;
        if (searchBy) {
            if (searchBy.orderBy === "asc") {
                brands = brands.sort(function (a, b) {
                    return ('' + a[searchBy.label]).localeCompare(b[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                });
            } else {
                brands = brands.sort(function (a, b) {
                    return ('' + b[searchBy.label]).localeCompare(a[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                });
            }
        }

        brands=brands.map((brand,index)=>{
            brand.index=index+1
            return brand;
        })


        let paginatedBrands = JSON.parse(JSON.stringify(brands)).slice((page) * perPage, (page + 1) * perPage);
        let checkedBrands = paginatedBrands.filter((brand) => brand.checked);


        return (
            <div className="row animated fadeIn">
                {showSnackBar && (
                    <SnackBar
                        open={showSnackBar}
                        message={snackBarMessage}
                        variant={snackBarVariant}
                        onClose={() => this.closeSnackBar()}
                    />
                )}
                <div className="col-12">
                    <div className="row space-1">
                        <div className="col-sm-4">
                            <h3>List of Brands</h3>
                        </div>
                        <div className="col-sm-4">
                            {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchBrand();
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
                            {checkedBrands.length > 0 &&
                            <button type="button" className="btn btn-danger" onClick={this.handleDeleteBrands}>Delete Brands</button>
                            }
                            <Link to="/brands/brand-form">
                                <button type="button" className="btn btn-success" style={{marginLeft: "10px"}}>Add New Brand</button>
                            </Link>
                        </div>

                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Sr. #</th>
                                <th>Name <span onClick={(e) => this.onHandleSearch("name")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                                <th>Image</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* {paginatedBrands && paginatedBrands.length >= 1 ? */}
                            {this.state.loading==false?
                                paginatedBrands.map((brand, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span>
                                            <input type={"checkbox"} checked={brand.checked}
                                                   onChange={(e) => this.handleSelectBrand(brand.index-1)}/>
                                        </span> {brand.index}
                                        </td>
                                        <td>{brand.name}</td>
                                        <td>{<img style={{height: '50px', width: '50px'}} src={brand.image}/>}</td>
                                        <td>
                                            <Link to={`/brands/edit-brand/${brand.uuid}`}>
                                                <span className="fa fa-edit" aria-hidden="true"></span>
                                            </Link>
                                        </td>
                                        <td>
                                            <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true"
                                                  onClick={() => this.deleteBrand(brand.uuid, index)}></span>
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
                        <Pagination prev next items={this.state.pages} activePage={this.state.activePage}
                                    onSelect={this.handleSelect.bind(this)}> </Pagination>
                    </div> */}
                     <div className="text-center">
                            <Pagination>
                                            <Pagination.Prev disabled={this.state.activePage>1?false:true}  onClick={()=>{this.fetchBrandMinus(this.state.activePage)}}/>
                                            <Pagination.Next disabled={this.state.activePage<this.state.pages?false:true} onClick={()=>{this.fetchBrandPlus(this.state.activePage)}}/>
                                        </Pagination>
                        </div>
                </div>
            </div>
        );
    }
}
