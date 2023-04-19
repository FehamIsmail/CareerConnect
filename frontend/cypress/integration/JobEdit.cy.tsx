import React from 'react'
import JobEdit from '../../src/pages/JobEdit'
import {withProviders} from "../../src/scripts/utils";

describe('<JobEdit />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<JobEdit />))
  })
})