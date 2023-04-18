/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />
import Chance from 'chance';

describe('Employer registration', () => {
  const chance = new Chance();
  const email = chance.email();
  const password = chance.string({ length: 10, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' });
  const first_name = chance.name();
  const last_name = chance.name();
  const company = chance.company()

  beforeEach(() => {
    cy.visit('localhost:3000/register');
    cy.get('input[name=first_name]').type(first_name);
    cy.get('input[name=last_name]').type(last_name);
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=repeat-password]').type(password);
    cy.get('input[type=checkbox]').click();
    cy.get('input[name=organization]').type(company);
    cy.get('button[type=submit]').click();
  });

  it('should redirect employer to login page after successful registration', () => {
    // Verify employer is redirected to login page after successful registration
    cy.url().should('eq', Cypress.config().baseUrl + '/login');

    // Fill out registration form with valid account details
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();

    // Verify employer is redirected to landing page after successful authentication
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});