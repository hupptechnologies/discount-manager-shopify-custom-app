import { configureStore } from '@reduxjs/toolkit';
import createDiscountSilce from './create-discount/slice';
import discountSilce from './discount/slice';
import storeSlice from './store/slice';

/**
	* Configures the Redux store for the application.
	* 
	* The store is configured with the Redux Toolkit's `configureStore` method, which simplifies the store setup and automatically enables Redux DevTools in non-production environments.
	* 
	* @example
	* const dispatch = useDispatch<AppDispatch>();
	* const state = useSelector<RootState, YourStateType>(state => state.createDiscount);
	* 
	* @returns {object} The Redux store object with the combined reducers and middleware.
	* 
	* `RootState` and `AppDispatch` are types inferred from the store's state and dispatch function respectively, and they are used for type safety in your app's components and hooks.
	* 
	* `RootState`: The type representing the entire state of the Redux store.
	* `AppDispatch`: The type representing the `dispatch` function for the store.
*/
const store = configureStore({
	reducer: {
		createDiscount: createDiscountSilce,
		discount: discountSilce,
		store: storeSlice
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
