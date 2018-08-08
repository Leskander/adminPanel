import React, { Component } from 'react';
import '../stylesheets/login-signup.css';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
//import '../stylesheets/index.css';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirect: false,
      Error: false,
      errorMsg: '',
      redirectURL: ''

    };
    this.onChange = this.onChange.bind(this);

  }

  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {

      var status = parseInt(userData.status)
      console.log(status)

      if (status === 0) {
        console.log("0")
        this.setState({ redirectURL: '/emailVerification' })
      }
      else if (status === 1) {
        console.log("1")
        this.setState({ redirectURL: '/profileSetup' })
      }
      else if (status === 2) {
        console.log("2")
        this.setState({ redirectURL: '/dashboard' })
      }

      this.setState({ redirect: true })
    }

  }


  errorMsg = () => {
    if (this.state.Error) {
      return <b> <p className="error-message"> {this.state.errorMsg}  </p> </b>
    }

  }

  submitData = (e) => {
    e.preventDefault();
    const data = {
      username: this.state.email,
      password: this.state.password
    };

    axios.post('/adminLogin', data)
      .then(
        response => {
          if (response.data.Error) {
            console.log(response.data);
            this.setState({
              Error: true,
              errorMsg: response.data.Message + " Try Again",
            })
          }
          else {
            let data = response.data.Data[0]
            console.log(data)
            localStorage.setItem('userData', JSON.stringify(data))
            var status = parseInt(data.status)
            console.log(status)

            if (status === 0) {
              console.log("0")
              this.setState({ redirectURL: '/emailVerification' })
            }
            else if (status === 1) {
              console.log("1")
              this.setState({ redirectURL: '/profileSetup' })
            }
            else if (status === 2) {
              console.log("2")
              this.setState({ redirectURL: '/dashboard' })
            }

            this.setState({ redirect: true })

          }
        })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    var style1 = {
      background: '#7386D5'
    }
    var style2 = {
      fontSize: '1.5em'
    }

    if (this.state.redirect) {
      return <Redirect to={this.state.redirectURL} />
    }

    return (

      <div style={style1}>
        <div className="limiter" style={style1}>
          <div className="container-login100">
            <center>
              <div className="wrap-login100">
                <form onSubmit={this.submitData}>
                  <div className="login100-form validate-form">
                    <span className="login100-form-title">
                      Member Login
                </span>

                    <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                      <input className="input100" type="email" name="email" onChange={this.onChange} placeholder="Email" required />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                      </span>
                    </div>

                    <div className="wrap-input100 validate-input" data-validate="Password is required">
                      <input className="input100" type="password" name="password" onChange={this.onChange} placeholder="Password" required />
                      <span className="focus-input100"></span>
                      <span className="symbol-input100">
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      </span>
                    </div>

                    <div>
                      <b>{this.errorMsg()}</b>
                    </div>

                    <div className="container-login100-form-btn">
                      <button className="login100-form-btn">
                        Login
                  </button>
                    </div>
                    <br />

                    <div className="text-center p-t-12">
                      <span className="txt1">
                        Forgot
                  </span>
                      <Link className="txt2" to="/recovery" >
                        Email / Password?
                  </Link>
                    </div>

                    <div className="text-center p-t-136">
                      <Link className="txt2" to="/signup" style={style2}>
                        <b>Create your Hostel Account</b>
                        <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                      </Link>
                    </div>

                  </div>

                </form>

              </div>
            </center>
          </div>
        </div>

      </div>
    );
  }
}

export default LogIn;