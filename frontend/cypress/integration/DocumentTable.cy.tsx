import { mount, } from "cypress/react18";
import React from 'react'
import DocumentTable, { DocumentTableProps } from '../../src/components/Documents/DocumentTable';
import {shortenFileName} from "../../src/scripts/utils";


describe('DocumentTable', () => {
  const mockDocumentList = [
    {
      id: '1',
      title: 'Document 1',
      fileName: 'document1.pdf',
      type: 'CV',
      resume: 'Resume 1',
      coverLetter: 'Cover Letter 1',
      default: false,
    },
    {
      id: '2',
      title: 'Document 2',
      fileName: 'document2.pdf',
      type: 'LETTER',
      resume: 'Resume 2',
      coverLetter: 'Cover Letter 2',
      default: false,
    },
  ];

  const mockProps: DocumentTableProps = {
    documentList: mockDocumentList,
    editDocument: () => {},
    setStatus: () => {},
  };

  beforeEach(() => {
    mount(<DocumentTable {...mockProps} />);
  });

  it('should render the correct document type name', () => {
    const type = mockDocumentList[0].type;
    const expectedTypeName =
        type === 'CV' ? 'Resumes' : type === 'LETTER' ? 'Cover Letters' : 'Application Packages';
    // @ts-ignore
    cy.findByText(expectedTypeName).should('exist');
  });

  it('should render the default document if there is one', () => {
    const defaultDocument = mockDocumentList.find((doc) => doc.default);
    if (defaultDocument) {
      // @ts-ignore
      cy.findByLabelText(`Set as default document for ${defaultDocument.title}`).should('be.checked');
    }
  });

})