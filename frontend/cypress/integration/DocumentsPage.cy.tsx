import DocumentsPage from '../../src/pages/DocumentsPage'
import {withProviders} from "../../src/scripts/utils";

describe('<DocumentsPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<DocumentsPage />))
  })
})