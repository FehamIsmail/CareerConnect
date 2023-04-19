import React from 'react'
import ApplicationsPage from './ApplicationsPage'
import {withProviders} from "../scripts/utils";

describe('<ApplicationsPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<ApplicationsPage />))
  })
})