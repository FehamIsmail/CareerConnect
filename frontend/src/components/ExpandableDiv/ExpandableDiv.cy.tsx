import React from 'react'
import ExpandableDiv from './ExpandableDiv'
import {withProviders} from "../../scripts/utils";

describe('<ExpandableDiv />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<ExpandableDiv />))
  })
})