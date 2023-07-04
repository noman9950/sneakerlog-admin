import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import {toolbarConfig} from "../static/_textEditor";
import SnackBar from "../components/SnackBar";

import { updateFAQ, getFAQ } from '../backend/services/faqService';

export default class FAQForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faq: [],
      previousContent: '',
      loading: false,
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    };
    this.postPrivacyPolicy = this.postPrivacyPolicy.bind(this);
  }
  
  componentDidMount() {
      getFAQ()
      .then((response) => {
        this.setState({
          faq: response,
          description: RichTextEditor.createValueFromString(response[0].faq, 'html'),
          previousContent: RichTextEditor.createValueFromString(response[0].faq, 'html'),
        });
      });
  }

  setDescription = (description) => {
    const { faq } = this.state;
    faq[0].faq = description.toString('html');
    this.setState({
      faq,
      description,
    });
  }

  postPrivacyPolicy(event) {
    event.preventDefault();
    const { loading, description, faq } = this.state;
    if (!loading) {
      const fd = new FormData();

      this.setState({ loading: true });
        let cloneObject = Object.assign({}, faq[0])
        updateFAQ(faq[0].uuid, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Updated successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error while updating",
              snackBarVariant: "error",
            });
          })
      }
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false })
  }

  revertChanges = () => {
    const {previousContent} = this.state;
    this.setState({
      description: previousContent
    })
  }

  render() {
    const {
      description,
      showSnackBar,
      snackBarMessage,
      snackBarVariant } = this.state;
      const {history} = this.props;
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
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter FAQ Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postPrivacyPolicy}
                  >

                  <div className="col-md-12 col-sm-12">
                    <RichTextEditor
                      value={description}
                      toolbarConfig={toolbarConfig}
                      onChange={(e) => {
                        this.setDescription(e);
                      }}
                    />
                  </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Update
                        </Button>
                        <Button
                          onClick={() => this.revertChanges()}
                          className={`mx-3 btn btn-danger btn-lg`}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

