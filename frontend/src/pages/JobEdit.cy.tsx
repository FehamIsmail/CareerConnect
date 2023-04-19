import React from 'react'
import JobEdit from './JobEdit'
import {withProviders} from "../scripts/utils";

describe('<JobEdit />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<JobEdit />))
  })
})