import React from 'react'
import DocumentsPage from './DocumentsPage'
import {withProviders} from "../scripts/utils";

describe('<DocumentsPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<DocumentsPage />))
  })
})