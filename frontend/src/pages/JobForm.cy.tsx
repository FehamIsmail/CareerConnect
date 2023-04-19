import React from 'react'
import JobForm from './JobForm'
import {withProviders} from "../scripts/utils";

describe('<JobForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(
        withProviders(<JobForm />)
    )
  })
})