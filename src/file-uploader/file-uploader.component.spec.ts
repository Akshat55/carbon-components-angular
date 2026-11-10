import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow } from "../test-helpers/web-components";
import { FileItem } from "./file-item.interface";
import { FileUploader } from "./file-uploader.component";

@Component({
	template: `
		<cds-file-uploader
			title="title"
			description="description"
			buttonText="buttonText"
			accept=".txt"
			[multiple]="true"
			[(ngModel)]="files">
		</cds-file-uploader>
	`,
	imports: [FileUploader, FormsModule]
})
class FileUploaderTest {
	files: Set<FileItem> = null;
}

/** Simulates the user choosing files with the web component's button. */
const chooseFiles = (uploader: Element, files: File[]) => {
	uploader.querySelector("cds-file-uploader-button")
		.dispatchEvent(new CustomEvent("cds-file-uploader-button-changed", { bubbles: true, detail: { addedFiles: files } }));
};

describe("FileUploader", () => {
	let fixture, wrapper, element, uploader: FileUploader;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				FileUploaderTest
			]
		});
	});

	const create = async () => {
		fixture = TestBed.createComponent(FileUploaderTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-file-uploader");
		uploader = fixture.debugElement.query(By.directive(FileUploader)).componentInstance;
	};

	// ngModel needs one pass to notice the new set before the uploader renders it
	async function setFiles(next: Set<FileItem>) {
		wrapper.files = next;
		await settle(fixture);
	}

	function fileItem(name: string, state: "edit" | "upload" | "complete" = "edit"): FileItem {
		return {
			uploaded: false,
			state,
			file: new File(["content"], name, { type: "text/plain" })
		} as FileItem;
	}

	const fileRows = (): any[] => Array.from(element.querySelectorAll("cds-file-uploader-item"));

	it("should work", async () => {
		await create();
		expect(uploader instanceof FileUploader).toBe(true);
		expect(element instanceof customElements.get("cds-file-uploader")).toBe(true);
	});

	it("should set title to 'title'", async () => {
		await create();
		expect(shadow(element, ".cds--file--label").textContent.trim()).toEqual("title");
	});

	it("should set description to 'description'", async () => {
		await create();
		expect(shadow(element, ".cds--label-description").textContent.trim()).toEqual("description");
	});

	it("should set buttonText to 'buttonText'", async () => {
		await create();
		expect(element.querySelector("cds-file-uploader-button").textContent).toContain("buttonText");
	});

	it("should only accept .txt files", async () => {
		await create();
		const button = element.querySelector("cds-file-uploader-button");
		expect(button.accept).toEqual(".txt");
		expect(shadow(button, ".cds--file-input").getAttribute("accept")).toEqual(".txt");
	});

	it("should propagate the change in files back to the form", async () => {
		await create();
		chooseFiles(element, [new File([""], "test-filename", { type: "text/html" })]);
		await settle(fixture);

		const added: FileItem[] = Array.from(wrapper.files);
		expect(added.map(item => item.file.name)).toEqual(["test-filename"]);
		expect(fileRows()[0].textContent.trim()).toEqual("test-filename");
	});

	it("should show the invalid icon and text on invalid file items", async () => {
		await create();
		await setFiles(new Set([{ ...fileItem("test-filename"), invalid: true, invalidTitle: "Invalid", invalidText: "Invalid Text" }]));

		const row = fileRows()[0];
		expect(row.invalid).toBe(true);
		expect(shadow(row, ".cds--file-invalid")).toBeTruthy();
		expect(shadow(row, ".cds--form-requirement").textContent).toContain("Invalid Text");
	});

	it("should add chosen files to the existing files", async () => {
		await create();
		await setFiles(new Set([fileItem("test-filename-added")]));

		chooseFiles(element, [new File(["test file"], "test-filename", { type: "text/html" })]);
		await settle(fixture);

		const names = Array.from<FileItem>(wrapper.files).map(item => item.file.name);
		expect(names).toEqual(["test-filename-added", "test-filename"]);
	});

	it("should render a file added to the existing set", async () => {
		await create();
		await setFiles(new Set<FileItem>());
		expect(fileRows().length).toBe(0);

		await setFiles(new Set([fileItem("first.txt")]));

		expect(fileRows().length).toBe(1);
		expect(fixture.nativeElement.textContent).toContain("first.txt");
	});

	it("should stop rendering files removed from the existing set", async () => {
		await create();
		await setFiles(new Set([fileItem("first.txt")]));
		expect(fileRows().length).toBe(1);

		await setFiles(new Set<FileItem>());

		expect(fileRows().length).toBe(0);
	});

	it("should remove a file with its delete button and update the form", async () => {
		await create();
		const item = fileItem("first.txt");
		await setFiles(new Set([item]));

		fileRows()[0].dispatchEvent(new CustomEvent("cds-file-uploader-item-beingdeleted", { bubbles: true, cancelable: true }));
		await settle(fixture);

		expect(wrapper.files.has(item)).toBe(false);
		expect(fileRows().length).toBe(0);
	});

	it("should swap the spinner for the complete icon when an upload finishes", async () => {
		await create();
		const item = fileItem("first.txt", "upload");
		await setFiles(new Set([item]));
		expect(fileRows()[0].state).toBe("uploading");
		expect(shadow(fileRows()[0], "cds-loading")).toBeTruthy();

		await setFiles(new Set([{ ...item, state: "complete" }]));

		expect(fileRows()[0].state).toBe("complete");
		expect(shadow(fileRows()[0], "cds-loading")).toBeFalsy();
	});

	it("should show the error text when a file turns out to be invalid", async () => {
		await create();
		const item = fileItem("first.txt");
		await setFiles(new Set([item]));
		expect(shadow(fileRows()[0], ".cds--form-requirement").hidden).toBe(true);

		await setFiles(new Set([{ ...item, invalid: true, invalidText: "file too large" }]));

		expect(shadow(fileRows()[0], ".cds--form-requirement").hidden).toBe(false);
		expect(shadow(fileRows()[0], ".cds--form-requirement").textContent).toContain("file too large");
	});
});

@Component({
	template: `<cds-file-uploader title="Reactive" [formControl]="control" />`,
	imports: [FileUploader, ReactiveFormsModule]
})
class ReactiveFileUploaderTest {
	control = new FormControl<Set<FileItem>>(new Set());
}

describe("FileUploader with reactive forms", () => {
	it("should update and disable with the form control", async () => {
		const fixture = TestBed.createComponent(ReactiveFileUploaderTest);
		await settle(fixture);
		const element = fixture.nativeElement.querySelector("cds-file-uploader");

		chooseFiles(element, [new File(["a"], "a.txt")]);
		await settle(fixture);
		expect(Array.from<FileItem>(fixture.componentInstance.control.value).map(item => item.file.name)).toEqual(["a.txt"]);

		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(element.querySelector("cds-file-uploader-button").disabled).toBe(true);
	});
});
