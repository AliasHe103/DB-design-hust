import hust from './hust.svg';
import sqlLogo from './mysql.svg'
import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [str, setStr] = useState('');
  const recvPing = async () => {
    return window.expose.ping();
  }
  useEffect(() => {
    let str = '';
    const solve = async () => {
      str = await recvPing();
      setStr(str);
    }
    solve();
    return () => {
      setStr('');
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div className={"logos"}>
          <img src={hust} className="hust-logo" alt="hust-logo" />
          <img src={sqlLogo} className="sql-logo" alt="sql-logo" />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Node.js version:{str} {!str&&'str is null'}
        </a>
      </header>
    </div>
  );
}

export default App;
