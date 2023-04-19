import React from 'react'
import Candidate from './Candidate'

describe('<Candidate />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Candidate />)
  })
})