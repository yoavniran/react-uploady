describe("UploadButton Tests", () => {

    before(() => {
        cy.visitStory("uploadButton", "simple");
    });

    it("Upload Button - Simple", () => {
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

        const fileName = "flower.jpg";

        cy.fixture(fileName, "base64").then((fileContent) => {
            cy.get("@fInput").upload(
                { fileContent, fileName, mimeType: "image/jpeg" },
                { subjectType: "input" });

            cy.wait(2000);
            cy.storyLog().assertItemStartFinish(fileName);
        });
    });
});
