import Candidate from '../../src/pages/Candidate'
import {withProviders} from "../../src/scripts/utils";

describe('<Candidate />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<Candidate />))
  })
})