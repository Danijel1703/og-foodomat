import mockUser from "./mockUser";

const mockVenue = {
	name: "Test Venue",
	description: "A great place to hold events.",
	address: "123 Main St",
	city: "Metropolis",
	postalCode: "12345",
	country: "Wonderland",
	email: "contact@testvenue.com",
	websiteUrl: "http://testvenue.com",
	phoneNumber: "+38512321901",
};

describe("venue create", () => {
	beforeEach(() => {
		it("handle authorization", () => {
			cy.get("button[name='logout']").then(($btn) => $btn.click());
			cy.visit("/user/login");
			cy.get("input[name='email']").type(mockUser.email);
			cy.get("input[name='password']").type(mockUser.password);
			cy.get("button[name='login-submit']").click();
		});

		cy.visit("/venue/create");
	});

	it("should submit the form and navigate to venue list", () => {
		cy.get("input[name='name']").type(mockVenue.name);
		cy.get("input[name='description']").type(mockVenue.description);
		cy.get("input[name='address']").type(mockVenue.address);
		cy.get("input[name='city']").type(mockVenue.city);
		cy.get("input[name='postalCode']").type(mockVenue.postalCode);
		cy.get("input[name='phoneNumber']").type(mockVenue.phoneNumber);
		cy.get("input[name='country']").type(mockVenue.country);
		cy.get("input[name='email']").type(mockVenue.email);
		cy.get("input[name='websiteUrl']").type(mockVenue.websiteUrl);

		cy.get("button").contains("Create").click();

		cy.url().should("include", "/venue/list");
	});
});

describe("venue edit", () => {
	beforeEach(() => {
		cy.visit("/venue/list");
		cy.get("button[name='edit-venue']").first().click();
	});

	it("should contain default values", () => {
		cy.get("input[name='name']").should("have.value", mockVenue.name);
		cy.get("input[name='description']").should(
			"have.value",
			mockVenue.description
		);
		cy.get("input[name='address']").should("have.value", mockVenue.address);
		cy.get("input[name='city']").should("have.value", mockVenue.city);
		cy.get("input[name='postalCode']").should(
			"have.value",
			mockVenue.postalCode
		);
		cy.get("input[name='phoneNumber']").should(
			"have.value",
			mockVenue.phoneNumber
		);
		cy.get("input[name='country']").should("have.value", mockVenue.country);
		cy.get("input[name='email']").should("have.value", mockVenue.email);
		cy.get("input[name='websiteUrl']").should(
			"have.value",
			mockVenue.websiteUrl
		);

		cy.get(".submit").should("not.be.disabled");
	});

	it("should enable the submit button when the form is valid", () => {
		cy.get("input[name='name']").type(mockVenue.name + "Edit Test");
		cy.get("input[name='description']").type(
			mockVenue.description + "Edit Test"
		);
		cy.get("input[name='address']").type(mockVenue.address + "Edit Test");
		cy.get("input[name='city']").type(mockVenue.city + "Edit Test");
		cy.get("input[name='postalCode']").type(mockVenue.postalCode + "Edit Test");
		cy.get("input[name='phoneNumber']").type(mockVenue.phoneNumber + 123);
		cy.get("input[name='country']").type(mockVenue.country + "Edit Test");
		cy.get("input[name='email']").type("edit.test@test.com");
		cy.get("input[name='websiteUrl']").type(
			mockVenue.websiteUrl + "edit-test.com"
		);
		cy.get(".submit").click();
		cy.url().should("include", "/venue/list");
	});
});
