import React, { Component } from 'react';
import '../stylesheets/profile-setup.css'
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";


class GeneralInfo extends Component {
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

        };
        this.onChange = this.onChange.bind(this);

    }


    errorMsg = () => {
        if (this.state.Error) {
            return <b> <p className="error-message"> {this.state.errorMsg}  </p> </b>
        }

    }

    submitData = (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log(userData);
        const data = {
            block_id: userData.block_id,
            hostel_id: userData.hostel_id,
            block_about: this.state.hostelDescription,
            block_lat: this.state.block_lat,
            block_lang: this.state.block_lang,
            block_mobile: this.state.hostelMobile,
            block_phone: this.state.hostelPhone,
            block_type: this.state.hostelType

        };


        console.log(data);
        console.log("ok");
        axios.post('/updateBlockGeneralInfo', data)
            .then(

                response => {
                    if (response.data.Error) {
                        console.log(response.data);
                        console.log(response.data.Error);

                        this.setState({
                            Error: true,
                            errorMsg: response.data.Message
                        })

                    } else {
                        console.log(response.data);
                        console.log(response.data.Error);
                        this.setState({
                            redirect: true
                        })

                    }
                })
        console.log("ok");


    }




    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state)
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }

        return (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">

                        <form className="marginauto " onSubmit={this.submitData}>
                            <h1 className="">
                                Step 1 of 4: General info
                            </h1>

                            <div className="margint60  text-paragraph">
                                <label>Hostel Type :</label>
                                <div className="radio text-paragraph">
                                    <label><input type="radio" name="hostelType" value="Boys" onChange={this.onChange} required />Boys</label>
                                </div>
                                <div className="radio text-paragraph">
                                    <label><input type="radio" name="hostelType" value="Girls" onChange={this.onChange} />Girls</label>
                                </div>
                            </div>
                            <br />

                            <div className="form-group text-paragraph">
                                <label >Hostel Mobile :</label>
                                <input type="tel" className="form-control" name="hostelMobile" onChange={this.onChange} placeholder="Enter Hostel Mobile Number" required></input>
                            </div>
                            <br />

                            <div className="form-group text-paragraph">
                                <label >Hostel Phone :</label>
                                <input type="tel" className="form-control" name="hostelPhone" onChange={this.onChange} placeholder="Enter Hostel Phone Number"></input>
                            </div>
                            <br />


                            {/*<div id="demo"><MapContainer /></div>
                    <div> <Demo /> </div>*/}


                            <div className="form-group text-paragraph">
                                <label >Hostel Desctiption :</label>
                                <textarea className="form-control" rows="5" id="comment" name="hostelDescription" onChange={this.onChange} ></textarea>
                            </div>

                            <div className="container-login100-form-btn">
                                <input type="submit" value="Next Step" className="login100-form-btn" />
                            </div>

                            {/* <div className="container-login100-form-btn">
                                <Link className="txt2" to="/facilities" >
                                    <button className="login100-form-btn" value="submit" type="submit" >
                                        Next
                            </button></Link>
                            </div> */}


                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default GeneralInfo;