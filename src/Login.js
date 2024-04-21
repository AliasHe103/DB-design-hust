import hust from './hust.svg';
import sqlLogo from './mysql.svg'
import {useRef, useState} from "react";
import {useNavigate} from "react-router";

function Login() {
    const relocate = useNavigate();
    const accountRef = useRef(null);
    const passwordRef = useRef(null);
    const [str, setStr] = useState('学生信息管理系统');

    const handleLogin =  async () => {
        const loginStatus = await window.expose.login(accountRef.current.value, passwordRef.current.value);
        if (loginStatus === 'login success') {
            relocate('/management');
        }
        else {
            setStr('账号或密码错误！');
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className={"logos"}>
                    <img src={hust} className="hust-logo" alt="hust-logo" />
                    <img src={sqlLogo} className="sql-logo" alt="sql-logo" />
                </div>
                <form className={'loginForm'} onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <span>账号：</span>
                        <input type={'account'} id={'account'} defaultValue={'root'} ref={accountRef}/>
                    </div>
                    <div>
                        <span>密码：</span>
                        <input type={'password'} id={'password'} defaultValue={'mysql'} ref={passwordRef}/>
                    </div>
                    <button className={'loginBtn'} onClick={handleLogin}>登录</button>
                </form>
                <div className="loginText text">
                    {str}
                </div>
            </header>
        </div>
    );
}

export default Login;
