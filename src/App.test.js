/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import DivisasForm from './Components/DivisasForm'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/*
it('check the onChange callback', () => {  
  const onChange = jest.fn(),
      props = {
          USD: '25.40',
          onChange
      },
      DivisasFormComponent = mount(<DivisasForm {...props} />).find('input');
      DivisasFormComponent.simulate('change', { target: {value: '28.83'} });
  expect(onChange).toHaveBeenCalledWith('28.83');
});
*/