import tinymce from "tinymce";

tinymce.PluginManager.add("specialComponentPlugin", (editor) => {
	editor.on("BeforeSetContent", (event) => {
		if (event.content) {
			event.content = event.content.replace(
				/<my-special-component(.*?)>(.*?)<\/my-special-component>/g,
				(_, attrs) => {
					return `<span class="my-special-component-placeholder" data-mce-resize="false" ${attrs}>Special Component</span>`;
				}
			);
		}
	});

	editor.on("PostProcess", (event) => {
		if (event.get) {
			event.content = event.content.replace(
				/<span class="my-special-component-placeholder"(.*?)>.*?<\/span>/g,
				(_, attrs) => {
					return `<my-special-component${attrs}></my-special-component>`;
				}
			);
		}
	});
});
