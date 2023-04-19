import React from 'react'
import ApplicationsPage from '../../src/pages/ApplicationsPage'
import {withProviders} from "../../src/scripts/utils";

describe('<ApplicationsPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<ApplicationsPage />))
  })
})