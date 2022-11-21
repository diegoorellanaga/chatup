import logo from './logo.svg';
import './App.css';
import Form from './components/posts/form'
import EnterPage from './components/register/enterPage'
import { Route, Routes } from 'react-router-dom';
import Home from './components/home'
import ImageModifier from './components/imageModifier'

function App() {

  var pageId = 1

  return (

    <Routes>
      <Route exact path="/login" element={<EnterPage />}/>
      <Route exact path="/" element={<Home />}/>
      <Route exact path="/chat" element={<Form pageId={1}/>}/>
      <Route exact path="/imageModifier" element={<ImageModifier />}/>
    </Routes>


  );
}

export default App;
