import { Template } from "../types";

class TemplateEditor extends HTMLElement {
	private inputElement: HTMLInputElement;
	private currentTemplateId: string | null = null;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.inputElement = document.createElement("input");
		this.shadowRoot!.appendChild(this.inputElement);

		this.inputElement.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				this.updateTemplate();
			}
		});

		this.inputElement.addEventListener("blur", () => {
			this.updateTemplate();
		});
	}

	connectedCallback() {
		this.render();
	}

	setTemplate(template: Template | null) {
		if (template) {
			this.currentTemplateId = template.id;
			this.inputElement.value = template.text;
		} else {
			this.currentTemplateId = null;
			this.inputElement.value = "";
		}
		this.render();
	}

	private updateTemplate() {
		if (this.currentTemplateId) {
			const newText = this.inputElement.value;
			const templateUpdatedEvent = new CustomEvent("template-updated", {
				detail: {
					id: this.currentTemplateId,
					text: newText,
				},
			});
			this.dispatchEvent(templateUpdatedEvent);
		}
	}

	render() {
		this.inputElement.style.width = "100%";
		this.inputElement.style.padding = "5px";
		this.inputElement.style.border = "1px solid #ccc";
	}
}

customElements.define("template-editor", TemplateEditor);
