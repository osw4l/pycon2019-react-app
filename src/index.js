import './index.css';
import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'sweetalert/dist/sweetalert.css';


ReactDOM.render(
    <App />
    , document.getElementById('root'));
registerServiceWorker();
