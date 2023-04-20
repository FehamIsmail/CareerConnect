import App from '../../src/components/App/App'
import {mount} from "cypress/react18";

import {withProviders} from "../../src/scripts/utils";

describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(withProviders(<App />))
  })
})