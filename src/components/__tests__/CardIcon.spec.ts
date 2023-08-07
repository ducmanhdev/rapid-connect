import {describe, it, expect} from 'vitest';

import {mount} from '@vue/test-utils';
import CardIcon from '../CardIcon.vue';

describe('CardIcon', () => {
  it('renders properly', () => {
    const wrapper = mount(CardIcon, {props: {code: '1'}});
    expect(wrapper.find('img'));
  });
});
