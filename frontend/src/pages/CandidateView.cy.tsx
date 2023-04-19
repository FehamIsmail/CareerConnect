import React from 'react'
import CandidateView from './CandidateView'
import {withProviders} from "../scripts/utils";

describe('<CandidateView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<CandidateView />))
  })
})