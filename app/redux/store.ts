import { configureStore } from '@reduxjs/toolkit';
import createDiscountSilce from './create-discount/slice';

const store = configureStore({
	reducer: {
		createDiscount: createDiscountSilce,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export default store;
