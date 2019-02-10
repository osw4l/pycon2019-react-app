import React, {Component} from 'react';
import axios from 'axios';
import './Login.css';
import DOMAIN from '../constants';
import SweetAlert from 'sweetalert-react';

export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            show_alert_login_error: false
        };
        this.Login = this.Login.bind(this);
    }

    Login(event){
        event.preventDefault();
        let username = this.refs.username.value;
        let password = this.refs.password.value;

        axios.post(`${DOMAIN}/rest-auth/login/`, {username, password})
            .then(res => {
                if (res.data['key']) {
                    localStorage.setItem('token', res.data['key']);
                    this.getUserData();
                }
            })
            .catch(error => {
                this.showAlertLoginError();
            });
    }

    getUserData() {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios.get(`${DOMAIN}/rest-auth/user/`)
            .then(res => {
                if (res.data) {
                    let user = `${res.data['first_name']} ${res.data['last_name']} (${res.data['username']})`;
                    localStorage.setItem('user', user);
                    this.props.checkLoginState();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    showAlertLoginError(){
        this.setState({
            show_alert_login_error: true
        });

        setTimeout(()=>{
            this.setState({
                show_alert_login_error: false
            });
        }, 5300);
    }

    render() {
        return (

            <div className="container-fuild back-login">
                <SweetAlert
                    show={this.state.show_alert_login_error}
                    type="error"
                    title="no se puede iniciar sesión."
                    text="Por favor, revise sus credenciales y vuelva a intentar."
                    onConfirm={() => this.setState({ show_alert_login_error: false })}
                />
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="row">
                    <div className="lc-block toggled" id="l-login">
                        <form className="col s12" onSubmit={this.Login}>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="username"
                                           type="text"
                                           ref="username"
                                           className="validate"
                                           validate="true"
                                           required="required"
                                           aria-required="true"/>
                                    <label htmlFor="username">
                                        Usuario
                                    </label>
                                </div>
                                <div className="input-field col s12">
                                    <input id="password"
                                           ref="password"
                                           type="password"
                                           className="validate"
                                           validate="true"
                                           required="required"
                                           aria-required="true"/>
                                    <label htmlFor="password">
                                        Contraseña
                                    </label>
                                </div>

                                    <button className="btn-floating btn-login  btn-float btn-large waves-effect waves-light amber darken-3 pulse"
                                            type="submit"
                                            name="action">
                                        <i className="material-icons">arrow_forward</i>
                                    </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
