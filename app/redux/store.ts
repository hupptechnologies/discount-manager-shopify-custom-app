import { configureStore } from '@reduxjs/toolkit';
import createDiscountSilce from './create-discount/slice';
import discountSilce from './discount/slice';

const store = configureStore({
	reducer: {
		createDiscount: createDiscountSilce,
		discount: discountSilce,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
