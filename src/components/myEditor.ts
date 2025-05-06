import { Template } from "../types";
import tinymce from "tinymce";
import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/code";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/content/default/content.css";
import "tinymce/content/default/content.min.css";
import "tinymce/content/default/content.css";
import "../tiny-mce-plugins/special-component-plugin";

class MyEditor extends HTMLElement {
	private shadow: ShadowRoot;
	private editor: any;
	private templates: Template[] = [];

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		const editorElement = document.createElement("div");
		editorElement.id = "my-editor";
		this.shadow.appendChild(editorElement);
	}

	connectedCallback() {
		tinymce.init({
			target: this.shadow.querySelector("#my-editor") as HTMLElement,
			plugins: "link lists code paste specialComponentPlugin",
			toolbar:
				"undo redo | bold italic | link | bullist numlist | code | specialComponentButton",
			menubar: false,
			skin: false,
			content_css: false,
			setup: (editor: any) => {
				this.editor = editor;

				editor.on("init", () => {});

				editor.ui.registry.addIcon(
					"special-component",
					'<svg width="24" height="24"><path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5zm2 2v2h2V7H7zm4 0v2h2V7h-2zm4 0v2h2V7h-2zM7 11v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zM7 15v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z" fill="currentColor"/></svg>'
				);

				editor.ui.registry.addButton("specialComponentButton", {
					icon: "special-component",
					text: "Insert",
					onAction: () => {
						const selectedTemplates = this.templates.map((template) => ({
							text: template.text,
							value: template.id,
						}));

						editor.insertContent(
							`<my-special-component templates='${JSON.stringify(
								this.templates
							)}'></my-special-component> `
						);
					},
				});
			},
		});
	}

	disconnectedCallback() {
		tinymce.remove(this.editor);
	}

	setTemplates(templates: Template[]) {
		this.templates = templates;
		if (this.editor) {
			const content = this.editor.getContent();
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = content;

			const specialComponents = tempDiv.querySelectorAll(
				"my-special-component"
			);
			specialComponents.forEach((component) => {
				component.setAttribute("templates", JSON.stringify(templates));
			});

			this.editor.setContent(tempDiv.innerHTML);
		}
	}

	getContent(): string {
		return this.editor ? this.editor.getContent() : "";
	}
}

customElements.define("my-editor", MyEditor);
