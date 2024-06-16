
import {useContext, useRef} from "react";
import {loginCall} from "../../apiCalls"
import {AuthContext} from "../../context/AuthContext";
import {CircularProgress} from "@mui/material";
import "./login.css"

export default function Login() {
    let email = useRef();
    let password = useRef();
    let {isFetching, dispatch} = useContext(AuthContext);

    let handleClick = (event) => {
        event.preventDefault();
        loginCall({email: email.current.value, password: password.current.value}, dispatch);
    }

    return(
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Social.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input ref={email} required type="email" placeholder="Email" className="loginInput" />
                        <input ref={password} required minLength="6" type="password" placeholder="Password" className="loginInput" />
                        <button className="loginButton" type="submit" disabled={isFetching}>
                            {isFetching ? <CircularProgress style={{color: "white"}} /> : "Log In"}
                        </button>
                        <div className="loginForgot">Forgot Password?</div>
                        <button className="loginRegisterButton" type="button">
                            {isFetching ? <CircularProgress style={{color: "white"}} /> : "Create a New Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
