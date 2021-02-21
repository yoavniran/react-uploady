const uploadFile = (fileName, cb, button = "button", options = {}, iframe) => {
    //support stories inside iframe and outside
    const get = (selector) => iframe ? cy.get(iframe).find(selector) : cy.get(selector);

    get(button)
        .should("be.visible")
        .click()
        .as("uploadButton");

    get(`input[type="file"]`)
        .should("exist")
        .as("fInput");

    const times = options.times || 1;
    const mimeType = options.mimeType || "image/jpeg";

    if (times === 1) {
        cy.get("@fInput")
            .attachFile({ filePath: fileName, encoding: "utf-8", mimeType })
            .then(cb);
    } else {
        cy.fixture(fileName, "base64")
            .then((fileContent) => {
                const files = new Array(times)
                    .fill(null)
                    .map((f, i) => ({
                        fileContent,
                        mimeType,
                        fileName: !i ? fileName : fileName.replace(".", `${i + 1}.`),
                    }));

                cy.get("@fInput")
                    .attachFile(files)
                    .then(cb);
            });
    }
};

export const uploadFileTimes = (fileName, cb, times, button = "button", options = {}, iframe) => {
    return uploadFile(fileName, cb, button, {...options, times, }, iframe);
};

export default uploadFile;
