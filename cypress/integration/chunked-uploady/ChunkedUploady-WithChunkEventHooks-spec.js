import intercept from "../intercept";
import uploadFile from "../uploadFile";

describe("ChunkedUploady - WithChunkEventHooks", () => {
    const fileName = "flower.jpg";

    before(() => {
        cy.visitStory("chunkedUploady", "with-chunk-event-hooks&knob-destination_Upload Destination=url&knob-upload url_Upload Destination=http://test.upload/url&knob-chunk size (bytes)_Upload Settings=50000");
    });

    it("should use chunked uploady with unique id", () => {
        intercept();

        cy.get("input")
            .should("exist")
            .as("fInput");

        uploadFile(fileName, () => {
            cy.wait(500);
            cy.storyLog().assertFileItemStartFinish(fileName, 1);

            let uniqueHeader;

            cy.wait("@uploadReq")
                .then((xhr) => {
                    uniqueHeader = xhr.request.headers["x-unique-upload-id"];

                    expect(xhr.request.headers["x-unique-upload-id"])
                        .to.match(/rpldy-chunked-uploader-/);

                    expect(xhr.request.headers["content-range"])
                        .to.match(/bytes 0-49999\//);
                });

            cy.wait("@uploadReq")
                .then((xhr) => {
                    expect(uniqueHeader).to.be.ok;
                    expect(uniqueHeader).to.equal(xhr.request.headers["x-unique-upload-id"]);

                    expect(xhr.request.headers["content-range"])
                        .to.match(/bytes 50000-\d+\//);
                });

            cy.storyLog().customAssertLogEntry("###CHUNK_START", (logLine) => {
                console.log("!!!!!!!!!1 ITEM ", logLine[0].item)
                expect(Object.getOwnPropertySymbols(logLine[0].item)).to.have.lengthOf(1, "CHUNK_START item - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0].chunk)).to.have.lengthOf(0, "CHUNK_START chunk - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0].sendOptions)).to.have.lengthOf(0, "CHUNK_START sendOptions - shouldnt have proxy symbols");
            });

            cy.storyLog().customAssertLogEntry("###CHUNK_FINISH", (logLine) => {
                expect(Object.getOwnPropertySymbols(logLine[0].item)).to.have.lengthOf(1, "CHUNK_FINISH item - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0].chunk)).to.have.lengthOf(0, "CHUNK_FINISH chunk - shouldnt have proxy symbols");
                expect(Object.getOwnPropertySymbols(logLine[0].uploadData)).to.have.lengthOf(0, "CHUNK_FINISH uploadData - shouldnt have proxy symbols");
            });
        }, "button");
    });
});
