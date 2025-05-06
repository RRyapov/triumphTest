import { Template } from "../types";

class MySpecialComponent extends HTMLElement {
	private templateId: string | null = null;
	private templates: Template[] = [];
	private shadow: ShadowRoot;
	private selectElement: HTMLSelectElement;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.selectElement = document.createElement("select");
		this.shadow.appendChild(this.selectElement);

		this.selectElement.addEventListener("change", () => {
			this.templateId = this.selectElement.value;
			this.render();
		});
	}

	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return ["templates"];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === "templates") {
			try {
				this.templates = JSON.parse(newValue);
				this.render();
			} catch (e) {
				console.error("Error parsing templates attribute", e);
			}
		}
	}

	setTemplates(templates: Template[]) {
		this.templates = templates;
		this.render();
	}

	getTemplateId(): string | null {
		return this.templateId;
	}

	render() {
		this.selectElement.innerHTML = "";

		if (!this.templates || this.templates.length === 0) {
			const option = document.createElement("option");
			option.textContent = "ERROR: No templates available";
			this.selectElement.appendChild(option);
			return;
		}

		this.templates.forEach((template) => {
			const option = document.createElement("option");
			option.value = template.id;
			option.textContent = template.text;
			this.selectElement.appendChild(option);
		});

		if (this.templateId) {
			this.selectElement.value = this.templateId;
		}
	}
}

customElements.define("my-special-component", MySpecialComponent);
