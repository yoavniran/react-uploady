describe("With Abort", () => {
    const fileName = "flower.jpg";
    
    before(() => {
        cy.visitStory("uploadButton", "with-abort");
    });

    it("should abort upload", () => {
        cy.iframe("#storybook-preview-iframe").as("iframe");

        cy.get("@iframe")
            .find("button")
            .click()
            .as("uploadButton");

        cy.get("@iframe")
            .find("input")
            .as("fInput");

        const abortSelector = "button[data-test='story-abort-button']";

        cy.get("@iframe")
            .find(abortSelector)
            .should("not.exist");

        cy.fixture(fileName, "base64").then(async (fileContent) => {
            cy.get("@fInput").upload(
                { fileContent, fileName, mimeType: "image/jpeg" },
                { subjectType: "input" });

            cy.wait(500).then(() => {
                cy.get("@iframe")
                    .find(abortSelector)
                    .should("be.visible")
                    .click();
            });

            cy.storyLog().assertLogPattern(/BATCH_ABORT/);
            cy.storyLog().assertLogPattern(/ITEM_FINISH/, { times: 0 });
        });
    });
});