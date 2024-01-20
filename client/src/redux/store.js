import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'
import reducer from "./reducers/reducer";
import { composeWithDevTools } from "redux-devtools-extension";

// const store = createStore(reducer, compose(applyMiddleware(thunk), composeWithDevTools()));
const store = createStore(reducer, compose(applyMiddleware(thunk)));

export default store;