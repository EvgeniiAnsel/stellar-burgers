export const mockBun = `[data-cy="643d69a5c3f7b9001cfa093c"]`;
export const mockSauce = `[data-cy="643d69a5c3f7b9001cfa0942"]`;
export const mockMain = `[data-cy="643d69a5c3f7b9001cfa0941"]`;
export const refModal = '[data-cy=cyModal]';
export const refCloseModal = '[data-cy=closeModal]';

const mockUrl = 'http://localhost:4000/';
export const getIngr = () => {
  cy.intercept('GET', '/api/ingredients', {
    fixture: 'mockIngredients.json'
  }).as('ingredients');

  cy.visit(mockUrl);
};
