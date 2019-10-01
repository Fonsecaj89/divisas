/* eslint-disable no-undef */
import { CAMBIAR, UPDATE_EURO } from '../../Redux/types';
import { addToCache, getCachedItem } from '../../Utils/cache';

const validateTime = timeCreated => {
    if (timeCreated === null) {
        return true;
    }
    const interval = 10 * 60 * 1000;
    const now = Date.now();

    const calculated = now - timeCreated;

    const toUpdate = calculated > interval;
    return toUpdate;
};

const updateEuro = async () => {
    await fetch('https://api.exchangeratesapi.io/latest?base=USD')
        .then(res => res.json())
        .then(response => {
            const euro = response.rates.EUR;
            addToCache('Euro', euro);
            addToCache('EuroQueryTime', Date.now());
        });
};

export const checkEuroValue = () => dispatch => {
    const timeCreated = getCachedItem('EuroQueryTime');

    const toUpdate = validateTime(timeCreated);

    if (toUpdate) {
        updateEuro().then(() => {
            const euro = getCachedItem('Euro');
            dispatch({
                type: UPDATE_EURO,
                payload: euro,
            });
        });
    }
};

export const cambiar = data => dispatch => {
    /* 
    Incluir la llamada acá
    Luego de tener éxito, llamar dispatch
    */

    const dolar = parseFloat(data.usd);
    const valorEuro = getCachedItem('Euro');

    if (valorEuro === null) {
        fetch('https://api.exchangeratesapi.io/latest?base=USD')
            .then(res => res.json())
            .then(response => {
                const euro = response.rates.EUR;
                addToCache('Euro', euro);
                addToCache('EuroQueryTime', Date.now());
                return euro;
            })
            .then(euro => {
                dispatch({
                    type: UPDATE_EURO,
                    payload: euro,
                });
            })
            .then(() => {
                const valor = dolar * getCachedItem('Euro');
                dispatch({
                    type: CAMBIAR,
                    payload: valor,
                });
            });
    } else {
        const valor = dolar * valorEuro;
        dispatch({
            type: CAMBIAR,
            payload: valor,
        });
    }
};
