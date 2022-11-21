import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));


//window.hostUrl = "http://localhost/test/";
window.hostUrl ="https://www.chat-up.rf.gd/server/"
window.chatImagesURL = "/images/chatimages/"
window.pageId = {homework_1:1}
window.canvasSize = 300
window.activeEffect = false
window.FPS = 30
window.canvasFPS  = 60
window.customVideowidth = 1000


root.render(
  <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
