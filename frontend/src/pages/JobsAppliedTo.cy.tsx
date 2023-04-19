import React from 'react'
import JobsAppliedTo from './JobsAppliedTo'
import {withProviders} from "../scripts/utils";

describe('<JobsAppliedTo />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<JobsAppliedTo />))
  })
})