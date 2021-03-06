import React, { Component } from 'react';
import './profile-setup.css'
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
import '../stylesheets/spinner.css'


class RoomTypeSetup extends Component {
    constructor(props) {
        super(props);
        this.displayRoom = [];
        this.state = {
            showRoom: this.displayRoom,
            roomTypes: [{ seaters: 1 }],
            messFacility: '',
            messFacilityMsg:'',
            securityFee: '',
            addmissionFee: '',
            addedRoom: [],
            setRoom: true,
            seaters: '',
            priceWithMess: '',
            priceWithOutMess: '',
            append: false,
            roomCount: 0,
            roomError: '',

        };
        this.onChangeRoomPrice = this.onChangeRoomPrice.bind(this);
        this.onChangeBasePrice = this.onChangeBasePrice.bind(this);
        this.saveRoom = this.saveRoom.bind(this);
        this.appendRoom = this.appendRoom.bind(this);

    }


    componentDidMount() {
        console.log("rooms")

        document.getElementById("b3").className += " active "
        document.getElementById("back-btn").style.display = "block";

        const token = JSON.parse(localStorage.getItem('hostelAdmin'));
    const data = {
      token: token,
    };

        axios.post('/checkMessFacilityStatus', data)
            .then(
                response => {
                    if (response.data.Error) {
                        console.log(response.data);
                        this.setState({ messFacility: false,
                        messFacilityMsg: "You have not selected Mess Facility. If your Hostel Have Mess then Select Mess from Facilities." })

                    }
                    else {
                        console.log("okkkkk " + response.data)
                        console.log(response.data)
                        this.setState({ messFacility: true })
                    }
                })

        axios.post('/getBlockFees', data)
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
                        const data = response.data.Data[0]
                        console.log(data)
                        if (data.admission_fee === 0) {
                            this.setState({ addmissionFee: '', })
                        }
                        else if (data.addmissionFee === 0) {
                            this.setState({ securityFee: '', })
                        }
                        else {
                            this.setState({
                                addmissionFee: data.admission_fee,
                                securityFee: data.security_fee,
                            })
                        }
                    }
                })


        axios.post('/getAllRoomTypes',data)
            .then(
                response => {
                    if (response.data.Error) {
                        console.log(response.data);

                        this.setState({
                            Error: true,
                            errorMsg: response.data.Message + " Try Again",
                        })
                    } else {
                        this.setState({ roomTypes: response.data.Data, })
                    }
                })


        axios.post('/getHostelRoomTypes', data)
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
                        const data = response.data.Data
                        console.log(data)
                        data.map((data, index) => {
                            var room = this.state.addedRoom;
                            room.push(parseInt(data.seaters));
                            this.setState({ addedRoom: room, roomCount: this.state.roomCount + 1 })
                            if (data.price_with_mess === 0) {
                                this.setState({
                                    seaters: data.seaters,
                                    priceWithMess: '',
                                    priceWithOutMess: data.base_price,
                                })
                            }
                            else {
                                this.setState({
                                    seaters: data.seaters,
                                    priceWithMess: data.price_with_mess,
                                    priceWithOutMess: data.base_price,
                                })
                            }

                            this.appendRoom(data.seaters);
                        })
                        this.setState({ setRoom: true });
                        document.getElementById('myTable').style.display = 'block';
                        this.setState({
                            seaters: '',
                            priceWithOutMess: '',
                            priceWithMess: '',
                        })
                    }
                })

    }


    onChangeRoomPrice(e) {
        this.setState({ [e.target.name]: e.target.value });
    }


    onChangeBasePrice(e) {
        this.setState({ [e.target.name]: e.target.value });
    }


    saveRoom(e) {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('hostelAdmin'));
        console.log("p1 " + this.state.priceWithMess)
        var data = ''
        if (this.state.priceWithMess == "") {
            data = {
                token: token,
                seaters: this.state.seaters,
                base_price: this.state.priceWithOutMess,
                price_with_mess: 0
            }
        }
        else {
            data = {
                token: token,
                seaters: this.state.seaters,
                base_price: this.state.priceWithOutMess,
                price_with_mess: this.state.priceWithMess
            }
        }

        console.log(data)

        axios.post('/AddHostelRoomType', data)
            .then(

                response => {
                    if (response.data.Error) {
                        console.log(response.data);

                        this.setState({
                            Error: true,
                            errorMsg: response.data.Message
                        })

                    } else {
                        console.log(response.data);
                        var room = this.state.addedRoom;
                        room.push(parseInt(this.state.seaters));
                        this.setState({ roomCount: this.state.roomCount + 1 })
                        this.appendRoom(this.state.seaters);
                        this.setState({ setRoom: true });
                        document.getElementById('myTable').style.display = 'block';
                        this.setState({
                            seaters: '',
                            priceWithOutMess: '',
                            priceWithMess: '',
                        })
                    }
                })
    }


    deleteRow(r, seaters) {
        // e.preventDefault();
        const token = JSON.parse(localStorage.getItem('hostelAdmin'));

        document.getElementById(seaters).remove();

        const data = {
            token: token,
            seaters: seaters
        }

        axios.post('/DeleteHostelRoomType', data)
            .then(

                response => {
                    if (response.data.Error) {
                        console.log(response.data);

                        this.setState({
                            Error: true,
                            errorMsg: response.data.Message
                        })

                    }
                    else {
                        console.log(response.data);
                        this.setState({ roomCount: this.state.roomCount - 1 })
                        var array = [...this.state.addedRoom];
                        var index = array.indexOf(parseInt(data.seaters))
                        array.splice(index, 1)
                        this.setState({ addedRoom: array });
                    }
                })
    }


    appendRoom(seaters) {

        if (this.state.messFacility) {
            this.displayRoom.push(
                <tr id={seaters}>
                    <td class="one">{this.state.seaters}</td>
                    <td class="two">{this.state.priceWithOutMess}</td>
                    <td class="three">{this.state.priceWithMess}</td>
                    <td class="four"><center><input class="alignCenter" id={this.state.seaters} value={this.state.seaters} onClick={(e) => this.deleteRow(e, seaters)} type="image" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI4IDI4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOCAyODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0wLDI0bDQsNGwxMC0xMGwxMCwxMGw0LTRMMTgsMTRMMjgsNGwtNC00TDE0LDEwTDQsMEwwLDRsMTAsMTBMMCwyNHoiIGZpbGw9IiNEODAwMjciLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                    </center></td>
                </tr>
            );
        }
        else {
            this.displayRoom.push(
                <tr id={seaters}>
                    <td class="one">{this.state.seaters}</td>
                    <td class="two">{this.state.priceWithOutMess}</td>
                    <td class="four"><center><input class="alignCenter" id={this.state.seaters} value={this.state.seaters} onClick={(e) => this.deleteRow(e, seaters)} type="image" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI4IDI4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOCAyODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0wLDI0bDQsNGwxMC0xMGwxMCwxMGw0LTRMMTgsMTRMMjgsNGwtNC00TDE0LDEwTDQsMEwwLDRsMTAsMTBMMCwyNHoiIGZpbGw9IiNEODAwMjciLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                    </center></td>
                </tr>
            );
        }


        this.setState({
            showRoom: this.displayRoom,
            setRoom: false
        });
    }


    getOptions() {
        let items = [];
        items.push(<option>Select Number Of Seater</option>)
        this.state.roomTypes.map((item, index) => {
            if (!this.state.addedRoom.includes(item.seaters)) {
                items.push(<option key={index} value={item.seaters}>{item.seaters}</option>);
            }
        });
        return items;
    }


    addRoom = () => {
        if (this.state.setRoom) {
            if (this.state.messFacility) {
                return (
                    <div class="row">
                        <div class="col-xs-4 col-md-4">
                            <select name="seaters" className="text-paragraph cselect " onChange={this.onChangeRoomPrice} >
                                {this.getOptions()}
                            </select>
                        </div>
                        <div class="col-xs-3 col-md-3">
                            <input type="number" name="priceWithMess" onChange={this.onChangeRoomPrice} placeholder="Charges With Mess" className="form-control text-paragraph" />

                        </div>
                        <div class="col-xs-4 col-md-4">
                            <input type="number" name="priceWithOutMess" onChange={this.onChangeRoomPrice} placeholder="Charges With Out Mess" className="form-control text-paragraph" />
                        </div>

                        <div class="col-xs-1 col-md-1">
                            <center><input class="alignCenter" type="image" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMC4wMjEgMTAwLjAyMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwLjAyMSAxMDAuMDIxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CjxnPgoJPHBhdGggZD0iTTUxLjQ0OSwwLjAyMUMyMy44NDUtMC43NzMsMC44MjUsMjAuOTYsMC4wMzIsNDguNTYzYy0wLjAxNCwwLjQ4Ni0wLjAyMSwwLjk3Mi0wLjAyMSwxLjQ1OCAgIGMwLDI3LjYxNCwyMi4zODYsNTAsNTAsNTBzNTAtMjIuMzg2LDUwLTUwQzEwMC4wMjMsMjIuOTU5LDc4LjQ5OSwwLjc5OSw1MS40NDksMC4wMjF6IE03OC4wMTEsNTcuMDIxaC0yMXYyMWgtMTR2LTIxaC0yMXYtMTRoMjEgICB2LTIxaDE0djIxaDIxVjU3LjAyMXoiIGZpbGw9IiM1N2I4NDYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" onClick={this.saveRoom} />
                            </center>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div class="row">
                        <div class="col-xs-6 col-md-">
                            <select name="seaters" className="text-paragraph cselect " onChange={this.onChangeRoomPrice} >
                                {this.getOptions()}
                            </select>
                        </div>
                        <div class="col-xs-5 col-md-5">
                            <input type="number" name="priceWithOutMess" onChange={this.onChangeRoomPrice} placeholder="Charges With Out Mess" className="form-control text-paragraph" />
                        </div>

                        <div class="col-xs-1 col-md-1">
                            <center><input class="alignCenter" type="image" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMC4wMjEgMTAwLjAyMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwLjAyMSAxMDAuMDIxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CjxnPgoJPHBhdGggZD0iTTUxLjQ0OSwwLjAyMUMyMy44NDUtMC43NzMsMC44MjUsMjAuOTYsMC4wMzIsNDguNTYzYy0wLjAxNCwwLjQ4Ni0wLjAyMSwwLjk3Mi0wLjAyMSwxLjQ1OCAgIGMwLDI3LjYxNCwyMi4zODYsNTAsNTAsNTBzNTAtMjIuMzg2LDUwLTUwQzEwMC4wMjMsMjIuOTU5LDc4LjQ5OSwwLjc5OSw1MS40NDksMC4wMjF6IE03OC4wMTEsNTcuMDIxaC0yMXYyMWgtMTR2LTIxaC0yMXYtMTRoMjEgICB2LTIxaDE0djIxaDIxVjU3LjAyMXoiIGZpbGw9IiM1N2I4NDYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" onClick={this.saveRoom} />
                            </center>
                        </div>
                    </div>
                )
            }

        }
    }


    changeState = () => {
        this.setState({ setRoom: true });
    }

    submitData = () => {
        if (this.state.roomCount < 1) {
            this.setState({ roomError: "Please Select Room Types" })
            return false
        }
        else {
            this.setState({ roomError: "" })

            const token = JSON.parse(localStorage.getItem('hostelAdmin'));
            const data = {
                token: token,
                admission_fee: this.state.addmissionFee,
                security_fee: this.state.securityFee,
            };


            axios.post('/updateBlockFees', data)
                .then(

                    response => {
                        if (response.data.Error) {
                            console.log(response.data);

                            this.setState({
                                Error: true,
                                errorMsg: response.data.Message
                            })
                            return false

                        }
                        else {
                            console.log(response.data);

                        }
                    })
            return true
        }
    }


    render() {
        loadProgressBar()
        
        let showRoomDetails
        if (this.state.messFacility) {
            showRoomDetails = (
                <tr>
                    <th class="one">Room Type</th>
                    <th class="two">Price Without Mess</th>
                    <th class="three">Price With Mess</th>
                    <th class="four">Remove Room</th>
                </tr>
            )

        }
        else {
            showRoomDetails = (
                <tr>
                    <th class="one">Room Type</th>
                    <th class="two">Price Without Mess</th>
                    <th class="four">Remove Room</th>
                </tr>
            )
        }

        return (

            <div className="marginauto ">

                <div className=" form-group margint20 text-paragraph">
                    <label >Hostel Admission Fee:</label>
                    <input type="number" name="addmissionFee" value={this.state.addmissionFee} onChange={this.onChangeBasePrice} className="form-control text-paragraph" />
                </div>
                <br />

                <div className="form-group text-paragraph">
                    <label>Security Fee:</label>
                    <input type="number" name="securityFee" value={this.state.securityFee} onChange={this.onChangeBasePrice} className="form-control text-paragraph" />
                </div>
                <br />

                <div className="form-group text-paragraph">
                    <div>
                        <label>Add Room Types</label>
                    </div>
                    <br /> <b> <p className="error-message">{this.state.roomError} </p> </b>
                    {this.addRoom()}
                    <p className="error-message">{this.state.messFacilityMsg}</p>
                    <br />
                    <table id="myTable" className="table table-bordered">

                        <thead >
                            {showRoomDetails}
                        </thead>
                        <tbody >
                            {this.displayRoom}
                        </tbody>
                    </table>

                </div>

            </div>
        )
    }
}

export default RoomTypeSetup;