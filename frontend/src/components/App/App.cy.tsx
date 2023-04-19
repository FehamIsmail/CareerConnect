import React from 'react'
import App from './App'
import {withProviders} from "../../scripts/utils";

describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<App />))
  })
})