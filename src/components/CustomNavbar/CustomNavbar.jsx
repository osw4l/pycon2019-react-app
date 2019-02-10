import React, {Component} from 'react'
import {Navbar, NavItem } from 'react-materialize';
import './CustomNavbar.css'
import axios from "axios/index";
import DOMAIN from "../constants";


export default class CustomNavbar extends Component {

    constructor() {
        super();
        this.state = {
            show_modal: false,
            user: localStorage.getItem('user')
        };
        this.Logout = this.Logout.bind(this);
    }


    Logout() {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios.post(`${DOMAIN}/rest-auth/logout/`, {})
            .then(res => {
                localStorage.clear();
                window.location.reload();
            })
            .catch(function (error) {
                console.log('logout error');
            });
    }


    render() {
        return (
            <Navbar className="light-green darken-1 position-sticky "
                    brand={
                        <div className="pull-little-left">Pycon Django React</div>
                    }
                    right>
                <NavItem onClick={()=> null}>
                    {this.state.user}
                </NavItem>
                <NavItem onClick={this.Logout}>
                    Salir
                </NavItem>

            </Navbar>
        )
    }
}
