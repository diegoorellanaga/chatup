import logo from './logo.svg';
import './App.css';
import Form from './components/posts/form'

function App() {
  var userId =1
  var pageId =1
  var userName ="Diego"
  var userLastName = "Doe"
  var userEmail = "some@crazy.com"
  return (
    <div className="App">

      <Form userId={userId} pageId={pageId} userName={userName} userLastName={userLastName} userEmail={userEmail}/>
    </div>
  );
}

export default App;
