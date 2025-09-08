const template = document.createElement("template");
template.innerHTML = `
	<link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/>
	<dialog>
		<!-- Modal content -->
		<div>
			<label for="title">Title:</label>
			<input id="title" type="text" size="25" maxlength="80" placeholder="Task title" autofocus/>
		</div>
		<div>
			<label for="status">Status:</label>
			<select id="status">
				<option value="0" selected>&lt;Modify&gt;</option>
			</select>
		</div>
		<button id="close">Close</button>
		<button id="submit" type="submit">Add task</button>
	</dialog>
`;

class TaskBox extends HTMLElement {
	#modal;
	#statusesList;
	
	#newTaskCallback;
	
	constructor() {
		super();
		
		const shadowRoot = this.attachShadow({ mode: "closed" });
		shadowRoot.appendChild(template.content.cloneNode(true));
		
		this.#modal = shadowRoot.querySelector("dialog");
		
		this.#statusesList = [];
	}
	
	setStatusesList(list) {
		this.#statusesList = list;
		
		const selectElement = this.#modal.querySelector("select");
		
		selectElement.innerHTML = "<option value='0' selected>&lt;Modify&gt;</option>";

		for (let status of this.#statusesList) {
			const newOption = document.createElement("option");
			newOption.value = status;
			newOption.innerText = status;
			selectElement.appendChild(newOption);
		}
	}
	
	setNewTaskCallback(callback) {
		this.#newTaskCallback = callback;
	}
	
	show() {
		this.#modal.show();
	}
	
	close() {
		this.#modal.close();
	}
}

customElements.define("task-box", TaskBox);
