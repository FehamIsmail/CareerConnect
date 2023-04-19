import React from 'react'
import Candidate from './Candidate'
import {withProviders} from "../scripts/utils";

describe('<Candidate />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<Candidate />))
  })
})