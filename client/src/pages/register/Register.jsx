
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./register.css";

export default function Register() {
    let username = useRef();
    let email = useRef();
    let password = useRef();
    let passwordAgain = useRef();
    let navigate = useNavigate();

    let handleClick = async (event) => {
        console.log("submit");
        event.preventDefault();
        if(passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            let user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };

            try {
                await axios.post("/auth/register", user);
                navigate("/login");
            } catch (err) {
                console.log(err);
            }
        }
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
                        <input ref={username} required placeholder="Username" className="loginInput" />
                        <input ref={email} required type="email" placeholder="Email" className="loginInput" />
                        <input ref={password} required minLength="6" type="password" placeholder="Password" className="loginInput" />
                        <input ref={passwordAgain} required type="password" placeholder="Password Again" className="loginInput" />
                        <button className="loginButton" type="submit">Sign up</button>
                        <button className="loginRegisterButton" type="button">Log into Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
