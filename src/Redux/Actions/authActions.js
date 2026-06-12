import api from '../../api';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_LOGOUT,
} from '../Constants/authConstants';

// Action Đăng nhập
export const login = (username, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        // Gọi trực tiếp Spring Boot Backend
        const { data } = await api.post('/auth/login', { username, password });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('user', JSON.stringify(data));
        
        return data; // Trả về data để component có thể redirect hoặc xử lý thêm
    } catch (error) {
        const message = error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message;
            
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: message,
        });
        
        throw new Error(message || "Sai tên đăng nhập hoặc mật khẩu");
    }
};

// Action Đăng ký
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const { data } = await api.post('/auth/register', userData);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });

        // Sau khi đăng ký thành công, cũng tự động login
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
        localStorage.setItem('user', JSON.stringify(data));
        
        return data;
    } catch (error) {
        const message = error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message;
            
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: message,
        });
        
        throw new Error(message || "Đăng ký thất bại");
    }
};

// Action Đăng xuất
export const logout = () => (dispatch) => {
    localStorage.removeItem('user');
    dispatch({ type: USER_LOGOUT });
};
