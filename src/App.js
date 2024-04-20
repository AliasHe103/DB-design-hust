import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import Manage from "./Manage"
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Login/>}></Route>
        <Route path={'/management'} element={<Manage/>}></Route>
        <Route path={'*'} element={null}></Route>
      </Routes>
    </div>
  );
}

export default App;
