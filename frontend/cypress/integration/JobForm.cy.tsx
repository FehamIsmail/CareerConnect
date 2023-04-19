import React from 'react'
import JobForm from '../../src/pages/JobForm'
import {withProviders} from "../../src/scripts/utils";

describe('<JobForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(
        withProviders(<JobForm />)
    )
  })
})