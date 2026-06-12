import { combineReducers } from "redux";
import { authReducer } from "./authReducer";

// Gom tất cả reducers lại
const rootReducer = combineReducers({
  auth: authReducer,
  // thông tin khách hàng
  customer: customerReducer,
  // thông tin sản phẩm
  product: productReducer,
});

export default rootReducer;
