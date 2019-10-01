/* eslint-disable no-undef */
const { localStorage } = window;

export const addToCache = (state, value) => {
    localStorage.setItem(state, JSON.stringify(value));
};

export const getCachedItem = state => {
    const item = localStorage.getItem(state);
    return JSON.parse(item);
};

export const removeCachedItem = state => {
    localStorage.removeItem(state);
}

export const cleanCache = () => {
    localStorage.clear();
}
