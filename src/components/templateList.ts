import { Template } from "../types";

class TemplateList extends HTMLElement {
	private templates: Template[] = [];
	private selectedTemplateId: string | null = null;
	private listElement: HTMLUListElement;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.listElement = document.createElement("ul");
		this.shadowRoot!.appendChild(this.listElement);
	}

	connectedCallback() {
		this.render();
	}

	setTemplates(templates: Template[]) {
		this.templates = templates;
		this.render();
	}

	getTemplates(): Template[] {
		return this.templates;
	}

	getSelectedTemplateId(): string | null {
		return this.selectedTemplateId;
	}

	private render() {
		this.listElement.innerHTML = "";
		this.templates.forEach((template) => {
			const listItem = document.createElement("li");
			listItem.textContent = template.text;
			listItem.dataset.id = template.id;
			listItem.classList.add("template-item");

			if (template.id === this.selectedTemplateId) {
				listItem.classList.add("selected");
			}

			listItem.addEventListener("click", () => {
				this.selectedTemplateId = template.id;
				this.shadowRoot!.querySelectorAll(".template-item").forEach((item) => {
					item.classList.remove("selected");
				});
				listItem.classList.add("selected");

				const templateSelectedEvent = new CustomEvent("template-selected", {
					detail: template.id,
				});
				this.dispatchEvent(templateSelectedEvent);

				this.render();
			});

			this.listElement.appendChild(listItem);
		});
	}
}

customElements.define("template-list", TemplateList);
