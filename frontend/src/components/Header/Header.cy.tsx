import React from 'react'
import Header from './Header'
import {withProviders} from "../../scripts/utils";

describe('<Header />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<Header />))
  })
})