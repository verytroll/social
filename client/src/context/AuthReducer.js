
export default function AuthReducer(state, action) {
    let result;

    switch(action.type) {
        case "LOGIN_START":
        {
            result = {
                user: null,
                isFetching: true,
                error: false,
            };
        } break;

        case "LOGIN_SUCCESS":
        {
            result = {
                user: action.payload,
                isFetching: false,
                error: false,
            }
        } break;

        case "LOGIN_FAILURE":
        {
            result = {
                user: null,
                isFetching: false,
                error: action.payload,
            }
        } break;

        case "FOLLOW":
        {
            result = {
                ...state,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload],
                }
            }
        } break;

        case "UNFOLLOW":
        {
            result = {
                ...state,
                user: {
                    ...state.user,
                }
            }
            for(let i = 0; i < result.user.followings.length; ++i) {
                if(result.user.followings[i] === action.payload) {
                    result.user.followings.splice(i, 1);
                    break;
                }
            }
        } break;

        default:
        {
            result = state;
        } break;
    }

    return(result);
}
