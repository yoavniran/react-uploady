import React  from "react";
import { getFilesFromDragEvent } from "html-dir-content";
import { UploadyContext } from "@rpldy/shared-ui/src/tests/mocks/rpldy-ui-shared.mock";
import UploadDropZone from "./UploadDropZone";

jest.mock("html-dir-content", () => ({
    getFilesFromDragEvent: jest.fn()
}));

describe("UploadDropZone tests", () => {

    beforeEach(() => {
        clearJestMocks(
            UploadyContext.upload,
            getFilesFromDragEvent,
        );
    });

    const testDropZone = (props) => {
        const mockRef = jest.fn();

        const wrapper = mount(<UploadDropZone
            {...props} ref={mockRef}>
            <span>test</span>
        </UploadDropZone>);

        const div = wrapper.find("div");

        const dropEvent = {
            dataTransfer: {},
            preventDefault: () => {
            },
            persist: () => {
            },
        };

        return {
            wrapper,
            div,
            dropEvent,
            mockRef
        };
    };

    it("should render drop zone & handle drop", async () => {

        const { div, dropEvent } = testDropZone({
            id: "testZone",
            className: "test-zone",
            autoUpload: true,
        });

        expect(div).toHaveProp("id", "testZone");
        expect(div).toHaveProp("className", "test-zone");

        expect(div.find("span")).toHaveText("test");

        const files = [1, 2];
        getFilesFromDragEvent.mockResolvedValueOnce(files);

        await div.props().onDrop(dropEvent);

        expect(getFilesFromDragEvent).toHaveBeenCalledWith(
            dropEvent,
            {}
        );

        expect(UploadyContext.upload)
            .toHaveBeenCalledWith(files, {
                autoUpload: true
            });
    });

    it("should pass htmlDirContentParams", async () => {
        const htmlDirParams = { recursive: true };

        const { div, dropEvent } = testDropZone({
            htmlDirContentParams: htmlDirParams
        });

        getFilesFromDragEvent.mockResolvedValueOnce([1, 2]);

        await div.props().onDrop(dropEvent);

        expect(getFilesFromDragEvent).toHaveBeenCalledWith(
            dropEvent,
            htmlDirParams
        );
    });

    it("should use provided drop handler", async () => {

        const dropHandler = jest.fn();

        const { div, dropEvent } = testDropZone({
            dropHandler,
        });

        const files = [1, 2];

        dropHandler.mockReturnValueOnce(files);

        await div.props().onDrop(dropEvent);

        expect(getFilesFromDragEvent).not.toHaveBeenCalled();

        expect(dropHandler).toHaveBeenCalledWith(dropEvent);
    });

    it("should add & remove drag className", () => {

        const onDragOverClassName = "drag-over";

        const { div, mockRef } = testDropZone({
            onDragOverClassName
        });

        const refElm = mockRef.mock.calls[0][0];

        div.simulate("dragover");
        expect(refElm.classList.contains("drag-over")).toBe(true);
        div.simulate("dragend");
        expect(refElm.classList.contains("drag-over")).toBe(false);

        div.simulate("dragover");
        expect(refElm.classList.contains("drag-over")).toBe(true);
        div.simulate("dragleave");
        expect(refElm.classList.contains("drag-over")).toBe(false);

        // withForwardRefMock.ref.current = null;
        // div.simulate("dragover");
    });
});
