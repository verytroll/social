
import {createContext, useReducer, useEffect} from "react"
import AuthReducer from "./AuthReducer";

const USER_STORAGE_KEY = "SOCIAL_USER";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null,
    isFetching: false,
    error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.user));
    }, [state.user]);

    return(
        <AuthContext.Provider value={{user: state.user, isFetching: state.isFetching, error: state.error, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}
