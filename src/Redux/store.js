import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './Reducers';

// Khởi tạo store với rootReducer và redux-thunk middleware
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;
