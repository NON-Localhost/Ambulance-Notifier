import {Routes, Route} from 'react-router-dom';

import Signup from '../Components/Auth/Signup/Signup';
import Login from '../Components/Auth/Login/Login';

function App() {
  return (
    <div style = {{height: '100vh', width: '100vw'}}>
      <Routes>
        <Route path = '/' element = {<Signup/>} />
        <Route path = '/login' element = {<Login/>} />
        <Route path = '/thanks' element = {<h1>Thanks You</h1>} />
      </Routes>
    </div>
  );
}

export default App;
