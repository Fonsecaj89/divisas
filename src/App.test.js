/* eslint-disable no-undef */
import React from 'react';
import { Provider } from 'react-redux';

import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import { configure, mount } from 'enzyme';

import DivisasForm from './Components/Divisas/form';

configure({ adapter: new Adapter() });
const mockStore = configureMockStore();

const store = mockStore({
    cambio: { cambio: 56.9 },
    USD: 23.5,
    authorized: false,
});

describe('<DivisasForm />', () => {
    it('render correctly component', () => {
        const divisasform = mount(
            <Provider store={store}>
                <DivisasForm />
            </Provider>
        );
        expect(divisasform).toMatchSnapshot();
    });
    it('Chek number of imputs', () => {
        const divisasform = mount(
            <Provider store={store}>
                <DivisasForm />
            </Provider>
        );
        expect(divisasform.find('Input').length).toEqual(2);
    });

    it('Set State test', () => {
        const divisasform = mount(
            <Provider store={store}>
                <DivisasForm />
            </Provider>
        );
        const input = divisasform.find('Input[name="USD"]').setState({ USD: '24.8' });
        expect(input.state()).toEqual({ USD: '24.8' });
    });
});
describe('Redux Actions', () => {
    it('Check Redux action', () => {
        // Dispatch the action
        const logout = () => ({ type: 'LOGOUT' });
        store.dispatch(logout());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: 'LOGOUT' };
        expect(actions).toEqual([expectedPayload]);
    });
});
