// cypress/e2e/modalTest/modal.cy.ts
describe('Ingredient Modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('open and close modal via close button', () => {
    // Убедимся, что модальное окно отсутствует
    cy.get('[data-cy="modal"]').should('not.exist');

    // Кликаем на первую карточку ингредиента
    cy.get('[data-cy="ingredient-card"]').first().click();

    // Убедимся, что модальное окно появилось
    cy.get('[data-cy="modal"]').should('exist');

    // Проверяем, что модальное окно содержит информацию о первом ингредиенте
    cy.fixture('ingredients.json').then((fixture) => {
      const firstIngredient = fixture.data[0];
      cy.get('[data-cy="modal-title"]').should('contain', firstIngredient.name);
      cy.get('[data-cy="modal-calories"]').should(
        'contain',
        firstIngredient.calories
      );
      cy.get('[data-cy="modal-proteins"]').should(
        'contain',
        firstIngredient.proteins
      );
      cy.get('[data-cy="modal-fat"]').should('contain', firstIngredient.fat);
      cy.get('[data-cy="modal-carbohydrates"]').should(
        'contain',
        firstIngredient.carbohydrates
      );
    });

    // Закрываем модальное окно через кнопку закрытия
    cy.get('[data-cy="modal-close"]').click();

    // Убедимся, что модальное окно исчезло
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('close modal by clicking overlay', () => {
    // Убедимся, что модальное окно отсутствует
    cy.get('[data-cy="modal"]').should('not.exist');

    // Кликаем на первую карточку ингредиента
    cy.get('[data-cy="ingredient-card"]').first().click();

    // Убедимся, что модальное окно появилось
    cy.get('[data-cy="modal"]').should('exist');

    // Проверяем, что модальное окно содержит информацию о первом ингредиенте
    cy.fixture('ingredients.json').then((fixture) => {
      const firstIngredient = fixture.data[0];
      cy.get('[data-cy="modal-title"]').should('contain', firstIngredient.name);
      cy.get('[data-cy="modal-calories"]').should(
        'contain',
        firstIngredient.calories
      );
      cy.get('[data-cy="modal-proteins"]').should(
        'contain',
        firstIngredient.proteins
      );
      cy.get('[data-cy="modal-fat"]').should('contain', firstIngredient.fat);
      cy.get('[data-cy="modal-carbohydrates"]').should(
        'contain',
        firstIngredient.carbohydrates
      );
    });

    // Закрываем модальное окно через клик на оверлей
    cy.get('[data-cy="modal-overlay"]', { timeout: 10000 })
      .should('exist')
      .click({ force: true });

    // Убедимся, что модальное окно исчезло
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
