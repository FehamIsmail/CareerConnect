import React from 'react'
import Banner from './Banner'
import {withProviders} from "../../scripts/utils";

describe('<Banner />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<Banner />))
  })
})