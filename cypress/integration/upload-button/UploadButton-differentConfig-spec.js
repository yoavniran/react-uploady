describe("Different Configuration", () => {
    const fileName = "flower.jpg";
    
    before(() => {
        cy.visitStory("uploadButton", "different-configuration");
    });

    const uploadWithButton = (selector, doAssertion) => {
        cy.get("@iframe")
            .find(selector)
            .should("be.visible")
            .click()

        cy.fixture(fileName, "base64").then((fileContent) => {
            cy.get("@iframe")
                .find("input").upload(
                { fileContent, fileName, mimeType: "image/jpeg" },
                { subjectType: "input" });

            doAssertion();
        });
    };

    it("should allow overriding upload options from button", () => {

        cy.iframe("#storybook-preview-iframe").as("iframe");

        //test button with autoUpload = false
        uploadWithButton("#upload-a", () => {
            cy.wait(100);
            cy.storyLog().assertLogEntryCount(1);
        });

        //test other button with custom destination header
        uploadWithButton("#upload-b", () => {
            cy.wait(100);

            cy.storyLog().assertLogEntryContains(1, {
                destination: {
                    headers: {
                        "x-test": "1234"
                    }
                }
            });
        });
    });
});