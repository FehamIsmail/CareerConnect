import React from 'react'
import { mount } from "cypress/react18";
import { DocumentForm } from './DocumentForm'
import 'cypress-file-upload';

describe('DocumentForm', () => {
  type MyDocumentProps = {
    action: "CREATE" | "EDIT";
    setStatus: () => void;
    resumeList: never[];
    letterList: never[];
  }

  const mockProps: MyDocumentProps = {
    action: "CREATE",
    setStatus: () => { /* do something */ },
    resumeList: [],
    letterList: []
  };

  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:8000/api/coverletter/').as('createDocument')
  })

  it('submits form data on create', () => {
    mount(<DocumentForm {...mockProps} />)
    cy.get('#title').type('Test document')
    cy.get('#file').attachFile('example.pdf')
    cy.get('#type').select('Cover Letter')
    cy.get('.inline-flex').click()
  })

  it('validates form input on create', () => {
    mount(<DocumentForm {...mockProps} />)
    cy.get('.inline-flex').click()
  })

  it('displays success message on create', () => {
    mount(<DocumentForm {...mockProps} />)
    cy.get('#title').type('Test document')
    cy.get('#file').attachFile('example.pdf')
    cy.get('.inline-flex').click()
  })
})