import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    results: [],
    loading: false,
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setResults(state, action) {
            state.results = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearResults(state) {
            state.results = [];
            state.error = null;
        },
    },
});

export const { setResults, setLoading, setError, clearResults } = searchSlice.actions;
export default searchSlice.reducer;