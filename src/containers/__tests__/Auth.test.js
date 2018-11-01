import React from 'react';
import { mount } from 'enzyme';

import Root from 'Root';
import Auth from '../Auth/Auth';

let wrapper;

describe('Auth', () => {
  beforeEach(() => {
    wrapper = mount(
      <Root>
        <Auth />
      </Root>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should show a sign up form', () => {
    expect(wrapper.find(Auth).length).toEqual(1);
    expect(wrapper.find('form').length).toEqual(1);
    expect(wrapper.find('input').length).toEqual(4);
    expect(wrapper.find('button').length).toEqual(1);
    expect(wrapper.find('a').length).toEqual(1);
  });

  it('should show a login form', () => {
    wrapper.find('a').simulate('click');
    wrapper.update();

    expect(wrapper.find(Auth).length).toEqual(1);
    expect(wrapper.find('form').length).toEqual(1);
    expect(wrapper.find('input').length).toEqual(2);
    expect(wrapper.find('button').length).toEqual(1);
    expect(wrapper.find('a').length).toEqual(1);
  });
});
