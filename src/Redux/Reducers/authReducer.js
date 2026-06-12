import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_LOGOUT,
} from '../Constants/authConstants';

// Kiểm tra user lưu trong localStorage khi khởi động
const userInfoFromStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

const initialState = {
    user: userInfoFromStorage,
    loading: false,
    error: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
        case USER_REGISTER_REQUEST:
            return { ...state, loading: true, error: null };
            
        case USER_LOGIN_SUCCESS:
        case USER_REGISTER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
            
        case USER_LOGIN_FAIL:
        case USER_REGISTER_FAIL:
            return { ...state, loading: false, error: action.payload };
            
        case USER_LOGOUT:
            return { ...state, user: null, error: null };
            
        default:
            return state;
    }
};
