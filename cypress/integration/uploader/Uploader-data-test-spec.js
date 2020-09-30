import uploadFile from "../uploadFile";

describe("Uploader - Event data test", () => {
    const fileName = "flower.jpg";

    before(() => {
        cy.visitStory("uploader", "test-events-data", true);
    });

    it("should upload and trigger events with non-proxy data", () => {

        uploadFile(fileName, () =>{
            cy.wait(2000);
            cy.storyLog().assertFileItemStartFinish(fileName, 2);

            cy.storyLog().customAssertLogEntry("###BATCH-ADD", (logLine) => {
                expect(Object.getOwnPropertySymbols(logLine[0])).to.have.lengthOf(0, "BATCH-ADD batch - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0])).to.have.lengthOf(0, "BATCH-ADD options - shouldnt have proxy symbols");
            });

            cy.storyLog().customAssertLogEntry("###REQUEST_PRE_SEND", (logLine) => {
                expect(Object.getOwnPropertySymbols(logLine[0])).to.have.lengthOf(0, "REQUEST_PRE_SEND items - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0][0])).to.have.lengthOf(1, "REQUEST_PRE_SEND items[0] - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[1])).to.have.lengthOf(0, "REQUEST_PRE_SEND options - shouldnt have proxy symbols");
                expect(logLine[0][0]._test).to.be.undefined;
                expect(logLine[1]._test).to.be.undefined;
            });

            cy.storyLog().customAssertLogEntry("###FILE-PROGRESS", (logLine) => {
                expect(Object.getOwnPropertySymbols(logLine[0])).to.have.lengthOf(1, "FILE-PROGRESS item - shouldnt have proxy symbols");
            });

            cy.storyLog().customAssertLogEntry("###FILE-FINISH", (logLine) => {
                expect(Object.getOwnPropertySymbols(logLine[0])).to.have.lengthOf(1, "FILE-FINISH item - shouldnt have proxy symbols");
                expect(logLine[0]._test).to.be.undefined;
            });

            cy.storyLog().customAssertLogEntry("###BATCH-FINISH", (logLine) => {
                expect(Object.getOwnPropertySymbols(logLine[0])).to.have.lengthOf(0, "BATCH-FINISH batch - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0].items[0])).to.have.lengthOf(0, "BATCH-FINISH batch item - shouldnt have proxy symbols");
            });

        }, "#upload-button", null);
    });
});
