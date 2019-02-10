import React, {Component} from 'react';
import './App.css';
import Home from './components/Home/Home';
import Navbar from './components/CustomNavbar/CustomNavbar';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './components/Login/Login';


class App extends Component {
    constructor() {
        super();
        this.state = {

        };
        this.checkLoginState = this.checkLoginState.bind(this);
    }

    componentWillMount() {
        this.checkLoginState();
    }

    checkLoginState() {
        this.setState({
            user_login: !!localStorage.getItem('token')
        });
    }

    render() {
        return (this.state.user_login ?
                (
                    <Router>
                        <div>
                            <Navbar checkLoginState={this.checkLoginState} />
                            <Route exact path="/" component={Home}/>
                        </div>
                    </Router>
                ) : (
                    <Login checkLoginState={this.checkLoginState} />
                )
        );
    }
}

export default App;

