describe("UploadButton Tests", () => {

    beforeEach(() => {
        cy.visitStory("uploadButton", "simple");
    });

    it("Upload Button - Simple", () => {
        cy.iframe("#storybook-preview-iframe")
            .then((iframe) => {

                cy.wrap(iframe.find("button"))
                    .should("be.visible")
                    .click();

                const rpldyFileInput = iframe.find("input");

                const fileName = "flower.jpg";

                cy.fixture(fileName, "base64").then((fileContent) => {
                    cy.wrap(rpldyFileInput).upload(
                        { fileContent, fileName, mimeType: "image/jpeg" },
                        { subjectType: 'input' });

                    cy.wait(3000);
                    cy.storyLog().assertItemStartFinish(fileName);
                });
            });
    });
})
