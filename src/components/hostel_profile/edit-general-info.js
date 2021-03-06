import React, { Component } from 'react';
//import './profile-setup.css'
import axios from 'axios';
import $ from 'jquery'

import { Redirect, Link } from "react-router-dom";


class EditGeneralInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostelType: '',
            hostelMobile: '',
            hostelPhone: '',
            hostelDescription: '',
            block_lat: '33.63963',
            block_lang: '73.08411',
            redirect: false,
            Error: false,
            errorMsg: '',
            selectedOption: '',
            hostelTypeError: '',
            mobileNumberError: '',
            image: '',

        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const hostelAdmin = JSON.parse(localStorage.getItem('hostelAdmin'));
        const data = {
            block_id: hostelAdmin.block_id,
            hostel_id: hostelAdmin.hostel_id,
        };

        axios.post('/getBlockGeneralInfo', data)
            .then(
                response => {
                    if (response.data.Error) {
                        console.log(response.data);

                        this.setState({
                            Error: true,
                            errorMsg: response.data.Message + " Try Again",
                        })
                    } else {
                        const data = response.data.Data[0]
                        console.log(data)

                        this.setState({
                            selectedOption: data.block_type,
                            hostelMobile: data.block_mobile,
                            hostelPhone: data.block_phone,
                            hostelDescription: data.block_about,
                            // block_lat: '33.63963',
                            // block_lang: '73.08411',
                        })
                        console.log(this.state.selectedOption)
                        if (this.state.selectedOption === "Boys")
                            document.getElementById("control_01").checked = true;
                        else if (this.state.selectedOption === "Girls")
                            document.getElementById("control_02").checked = true;

                    }
                })



    }


    errorMsg = () => {
        if (this.state.Error) {
            return <b> <p className="error-message"> {this.state.errorMsg}  </p> </b>
        }
    }

    validateForm = () => {
        var radios = document.getElementsByName("hostelType");
        var formValid = false;

        var i = 0;
        while (!formValid && i < radios.length) {
            if (radios[i].checked) formValid = true;
            i++;
        }

        return formValid;
    }

    submitData = (e) => {

        var Boys = document.getElementById("control_01").checked
        var Girls = document.getElementById("control_02").checked
        var mobileNo = document.getElementById("hostelMobile").value
        var complete = true
        if ((Boys === true || Girls === true)) {
            this.setState({ hostelTypeError: "" })
        }
        else {
            complete = false;
            this.setState({ hostelTypeError: "Please Select Hostel Type" })

        }
        if (!mobileNo) {
            complete = false;
            this.setState({ mobileNumberError: "Please Enter Hostel Mobile Number" })
        }
        else {
            this.setState({ mobileNumberError: "" })
        }

        if (complete === false) {
            return false
        }
        else {
            const hostelAdmin = JSON.parse(localStorage.getItem('hostelAdmin'));
            const data = {
                block_id: hostelAdmin.block_id,
                hostel_id: hostelAdmin.hostel_id,
                block_about: this.state.hostelDescription,
                block_lat: this.state.block_lat,
                block_lang: this.state.block_lang,
                block_mobile: this.state.hostelMobile,
                block_phone: this.state.hostelPhone,
                block_type: this.state.hostelType

            };
            console.log(data);

            axios.post('/updateBlockGeneralInfo', data)
                .then(
                    response => {
                        if (response.data.Error) {
                            console.log(response.data);

                            this.setState({
                                Error: true,
                                errorMsg: response.data.Message
                            })
                            return false
                        } else {
                            console.log(response.data);
                            console.log(response.data.Error);
                            return true

                        }
                    })
            return true
        }

    }


    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }




    render() {
        if (this.state.redirect) {
            console.log("go")
            return <Redirect exact to="/" />
        }

        return (
            <div>

                <div className="marginauto">


                    <div className="margint60  text-paragraph">
                        <label>Hostel Type :</label> <br /> <b> <p className="error-message">{this.state.hostelTypeError} </p> </b>
                    </div>

                    <section>
                        <div>
                            <input type="radio" id="control_01" name="hostelType" value="Boys" onChange={this.onChange} required />
                            <label className="label1" htmlFor="control_01">
                                <h2>Boys</h2>
                            </label>

                        </div>
                        <div>
                            <input type="radio" id="control_02" name="hostelType" value="Girls" onChange={this.onChange} required />
                            <label className="label1" htmlFor="control_02">
                                <h2>Girls</h2>
                            </label>
                        </div>
                    </section>
                    <div className="row margint20">
                        <div className="col-xs-6 col-md-6">

                            <div className="form-group text-paragraph">
                                <label >Hostel Mobile :</label>
                                <input type="number" name="hostelMobile" id="hostelMobile" value={this.state.hostelMobile} onChange={this.onChange} placeholder="Hostel Mobile #" maxlength="11" className="form-control text-paragraph" required />
                                <br /> <b> <p className="error-message">{this.state.mobileNumberError} </p> </b>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-6">

                            <div className="form-group text-paragraph">
                                <label >Hostel Phone :</label>
                                <input type="number" name="hostelPhone" value={this.state.hostelPhone} onChange={this.onChange} placeholder="Hostel Phone #" maxlength="11" className="form-control text-paragraph" />

                            </div>
                        </div>
                    </div>


                    <div className="form-group text-paragraph">
                        <label >Hostel Desctiption :</label>
                        <textarea className="form-control" value={this.state.hostelDescription} rows="5" id="comment" name="hostelDescription" onChange={this.onChange} ></textarea>
                    </div>



                </div>
            </div>

        );
    }
}

export default EditGeneralInfo;