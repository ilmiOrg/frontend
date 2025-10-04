import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './styles/variables.css';
import './styles/core.css';
import './styles/animations.css';
import './styles/responsive.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);