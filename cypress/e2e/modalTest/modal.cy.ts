describe('Ingredient Modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('open and close modal via close button', () => {
    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('close modal by clicking overlay', () => {
    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal-overlay"]', { timeout: 10000 })
      .should('exist')
      .click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
