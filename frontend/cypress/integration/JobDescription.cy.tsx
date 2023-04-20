import JobDescription from '../../src/components/JobDescription/JobDescription'
import {withProviders} from "../../src/scripts/utils";

describe('<JobDescription />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<JobDescription />))
  })
})
