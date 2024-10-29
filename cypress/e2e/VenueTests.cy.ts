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
	phoneNumber: "+1-555-123-4567",
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
