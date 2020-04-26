describe("Disabled During Upload", () => {
    const fileName = "flower.jpg";
    
    before(() => {
        cy.visitStory("uploadButton", "disabled-during-upload");
    });

    it("should disable upload button during upload", () => {

        cy.iframe("#storybook-preview-iframe").as("iframe");

        cy.get("@iframe")
            .find("button")
            .should("be.visible")
            .click()
            .as("uploadButton");

        cy.get("@iframe")
            .find("input")
            .should("exist")
            .as("fInput");

        cy.fixture(fileName, "base64").then((fileContent) => {
            cy.get("@fInput").upload(
                { fileContent, fileName, mimeType: "image/jpeg" },
                { subjectType: "input" });

            cy.wait(100);
            cy.get("@uploadButton").should("be.disabled");

            cy.wait(2000);
            cy.storyLog().assertItemStartFinish(fileName, 1);
            cy.get("@uploadButton").should("not.be.disabled");
        });
    });
});