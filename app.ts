import "./components/template-list";
import "./components/template-editor";
import "./components/my-editor";
import { Template } from "./src/types";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";
const initialTemplates: Template[] = [
	{ id: uuidv4(), text: "Template 1" },
	{ id: uuidv4(), text: "Template 2" },
	{ id: uuidv4(), text: "Template 3" },
];

class App {
	private templates: Template[] = initialTemplates;
	private selectedTemplateId: string | null = null;

	constructor() {
		this.init();
	}

	init() {
		const templateList = document.querySelector("template-list") as any;
		const templateEditor = document.querySelector("template-editor") as any;
		const myEditor = document.querySelector("my-editor") as any;

		templateList.setTemplates(this.templates);
		myEditor.setTemplates(this.templates);

		templateList.addEventListener("template-selected", (event: any) => {
			this.selectedTemplateId = event.detail;
			const selectedTemplate =
				this.templates.find((t) => t.id === this.selectedTemplateId) || null;
			templateEditor.setTemplate(selectedTemplate);
		});

		templateEditor.addEventListener("template-updated", (event: any) => {
			const { id, text } = event.detail;
			this.templates = this.templates.map((t) =>
				t.id === id ? { ...t, text } : t
			);
			templateList.setTemplates(this.templates);
			myEditor.setTemplates(this.templates);
		});

		const addTemplateButton = document.getElementById("add-template");
		const deleteTemplateButton = document.getElementById("delete-template");

		addTemplateButton?.addEventListener("click", () => {
			const newTemplate: Template = { id: uuidv4(), text: "New Template" };
			this.templates = [...this.templates, newTemplate];
			templateList.setTemplates(this.templates);
			myEditor.setTemplates(this.templates);
		});

		deleteTemplateButton?.addEventListener("click", () => {
			if (this.selectedTemplateId) {
				this.templates = this.templates.filter(
					(t) => t.id !== this.selectedTemplateId
				);
				this.selectedTemplateId = null;
				templateList.setTemplates(this.templates);
				templateEditor.setTemplate(null);
				myEditor.setTemplates(this.templates);
			}
		});
	}
}

new App();
