
import axios from "axios";
import {LoginStart, LoginSuccess, LoginFailure} from "./context/AuthActions";

export const loginCall = async (userCredential, dispatch) => {
    dispatch(LoginStart());
    try {
        let res = await axios.post("auth/login", userCredential);
        dispatch(LoginSuccess(res.data));
    } catch(err) {
        dispatch(LoginFailure(err));
    }
}
