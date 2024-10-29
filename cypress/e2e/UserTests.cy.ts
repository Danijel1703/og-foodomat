import mockUser from "./mockUser";

describe("Check if the user can register", () => {
	beforeEach(() => {
		cy.visit("/user/register");
	});

	it("should disable the submit button if the form is invalid", () => {
		cy.get("button[name='register']").should("be.disabled");
	});

	it("should submit the form and navigate to venue list", () => {
		cy.get("input[name='email']").type(mockUser.email);
		cy.get("input[name='password']").type(mockUser.password);
		cy.get("input[name='confirmPassword']").type(mockUser.confirmPassword);
		cy.get("input[name='firstName']").type(mockUser.firstName);
		cy.get("input[name='lastName']").type(mockUser.lastName);
		cy.get("input[name='username']").type(mockUser.username);

		cy.get("button[name='register']").should("not.be.disabled");

		cy.get("button[name='register']").click();

		cy.url().should("include", "/venue/list");
	});
});

describe("Checks if the user can log in", () => {
	const redirectRoute = "/venue/list";

	beforeEach(() => {
		cy.logout();
		cy.visit("/user/login");
	});

	it("Submits form and redirects upon successful login", () => {
		cy.get("input[name='email']").type(mockUser.email);
		cy.get("input[name='password']").type(mockUser.password);

		cy.get("button[name='login-submit']").click();

		cy.url().should("include", redirectRoute);
	});
});
