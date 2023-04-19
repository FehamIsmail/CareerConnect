import React from 'react'
import DocumentsPage from './DocumentsPage'

describe('<DocumentsPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DocumentsPage />)
  })
})