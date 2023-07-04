import React from 'react';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { toolbarConfig } from "../static/_textEditor";
import { getTerms, updateTerms } from "../backend/services/termsService"
import SnackBar from "../components/SnackBar";

export default class TermsServiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: [],
      previousContent: '',
      loading: false,
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    };
  }

  componentDidMount() {
    getTerms()
      .then((response) => {
        this.setState({
          terms: response,
          description: RichTextEditor.createValueFromString(response[0].termsOfService, 'html'),
          previousContent: RichTextEditor.createValueFromString(response[0].termsOfService, 'html')
        });
      });
  }

  setDescription = (description) => {
    const { terms } = this.state;
    terms[0].termsOfService = description.toString('html');
    this.setState({
      terms,
      description,
    });
  }

  postTermsService = (event) => {
    event.preventDefault();
    const { loading, description, terms } = this.state;
    if (!loading) {
      const fd = new FormData();

      this.setState({ loading: true });
      let cloneObject = Object.assign({}, terms[0])
      updateTerms(terms[0].uuid, cloneObject)
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
    const { description,
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
                  <h2>Enter Terms of Service Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postTermsService}
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

