import React from 'react'
import JobDescription from './JobDescription'
import {withProviders} from "../../scripts/utils";

describe('<JobDescription />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<JobDescription />))
  })
})
