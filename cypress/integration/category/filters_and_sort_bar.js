// <reference types="cypress" />

describe("Category view - filtering and sorting", () => {
  let polyfill = null;

  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route("POST", `${Cypress.env("API_URI")}`).as("graphqlQuery");

    cy.visit("/category/accessories/7/", {
      onBeforeLoad(win) {
        delete win.fetch;
        // since the application code does not ship with a polyfill
        // load a polyfilled "fetch" from the test
        win.eval(polyfill);
        win.fetch = win.unfetch;
      },
    });
  });

  it("should show correct number of products in category if no filtering applied", () => {
    cy
      .get("[data-test=productsFoundCounter]")
      .should("have.text", "Products found: 7");
  });

  it("should show filter sidebar after clicking on filter menu", () => {
    cy
      .get("[data-test=filterSidebar]")
      .should("have.length", 0)
      .openFilterSidebar()
      .get("[data-test=filterSidebar]")
      .should("have.length", 1);
  });

  it("should hide filter sidebar after clicking on close icon button", () => {
    cy
      .get("[data-test=filterSidebar]")
      .should("have.length", 0)
      .openFilterSidebar()
      .get("[data-test=filterSidebar]")
      .should("have.length", 1)
      .get("[data-test=hideFilters]")
      .click()
      .get("[data-test=filterSidebar]")
      .should("have.length", 0);
  });

  it("should filter products after clicking on filter attribute", () => {
    cy
      .openFilterSidebar()
      .get("label")
      .first()
      .click()
      .get("[data-test=productsFoundCounter]")
      .should("have.text", "Products found: 5")
      .get("[data-test=productTile")
      .should("have.length", 5);
  });

});
