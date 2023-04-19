import React from 'react'
import App from './App'
import {mount} from "cypress/react18";

import {withProviders} from "../../scripts/utils";

describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(withProviders(<App />))
  })
})