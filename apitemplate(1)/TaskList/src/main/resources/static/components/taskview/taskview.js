import "../tasklist/tasklist.js";
import "../taskbox/taskbox.js";

const template = document.createElement("template");
template.innerHTML = `
	<link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskview.css"/>
	<h1>Tasks</h1>
	<p id="message">Waiting for server data.</p>
	<div id="newtask">
		<button type="button" disabled>New task</button>
	</div>
	<!-- The task list -->
	<task-list></task-list>
	<!-- The Modal -->
	<task-box></task-box>
`;

/**
  * TaskView
  * Manage view with list of tasks
  */
class TaskView extends HTMLElement {
	
	#apiUrl;
	
	#taskList;
	
	#taskBox;
	#messageDiv;
	
	
    constructor() {
        super();
		this.#apiUrl = this.dataset.serviceurl;

		const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.append(template.content.cloneNode(true));
		
		this.#taskList = shadowRoot.querySelector("task-list");
		this.#messageDiv = shadowRoot.querySelector("#message");
		this.#taskBox = shadowRoot.querySelector("task-box");

		this.#fetchTasks();
		this.#fetchStatuses();

		this.#taskList.changestatusCallback((id, newStatus) => {
			console.log(`Status ${newStatus} for task ${id} approved`)
		});
		this.#taskList.deletetaskCallback((id) => {
	        console.log(`Delete of task ${id} approved`)
	    });
		this.#taskBox.setStatusesList();
		
		this.#taskBox.show();
		taskbox.setNewTaskCallback((task) => {
			console.log(`Have '${task.title}' with status ${task.status}.`);
			taskbox.close();
		});
    }
	
	async #fetchTasks() {
		const res = await fetch(this.#apiUrl + "/tasklist");
		if (!res.ok) return;
		const json = await res.json();
		if (!json.responseStatus) return;
		const tasks = json.tasks;
		this.#messageDiv.innerText = `Found ${tasks.length} tasks`;
		for (let task of tasks) {
			this.#taskList.showTask(task);
		}
	}
	
	async #fetchStatuses() {
		const res = await fetch(this.#apiUrl + "/allstatuses");
		if (!res.ok) return;
		const json = await res.json();
		if (!json.responseStatus) return;
		const statuses = json.allstatuses;
		this.#taskList.setStatusesList(statuses);
		this.#taskBox.setStatusesList(statuses);
	}
}

customElements.define('task-view', TaskView);