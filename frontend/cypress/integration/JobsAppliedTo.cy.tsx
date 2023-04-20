import JobsAppliedTo from '../../src/pages/JobsAppliedTo'
import {withProviders} from "../../src/scripts/utils";

describe('<JobsAppliedTo />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<JobsAppliedTo />))
  })
})