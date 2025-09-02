const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/tasklist.css"/>

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {
	
    #taskList;

	#statusesList;
	
	#statusCallback;
	#deleteTaskCallback;

    constructor() {
        super();

		const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.append(template.content.cloneNode(true));

        this.#taskList = shadowRoot.querySelector("#tasklist");
		this.#taskList.appendChild(tasktable.content.cloneNode(true));

        this.#statusesList = [];
    }

    /**
     * @public
     * @param {Array} list with all possible task statuses
     */
    setStatusesList(allstatuses) {
        this.#statusesList = allstatuses;
    }

    /**
     * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
     * @public
     * @param {function} callback
     */
    changestatusCallback(callback) {
        this.#statusCallback = callback;
    }

    /**
     * Add callback to run on click on delete button of a task
     * @public
     * @param {function} callback
     */
    deletetaskCallback(callback) {
		this.#deleteTaskCallback = callback;
    }

    /**
     * Add task at top in list of tasks in the view
     * @public
     * @param {Object} task - Object representing a task
     */
    showTask(task) {
        const newTaskRow = taskrow.content.cloneNode(true);
		newTaskRow.children[0].dataset.id = task.id;
		const taskDataElements = newTaskRow.querySelectorAll("td");
        taskDataElements[0].innerText = task.title;
        taskDataElements[1].innerText = task.status;
		
		const selectElement = newTaskRow.querySelector("select");
		
		for (let status of this.#statusesList) {
			const newOption = document.createElement("option");
			newOption.value = status;
			newOption.innerText = status;
			selectElement.appendChild(newOption);
		}
		
		selectElement.addEventListener("change", () => {
			if (!window.confirm(`Do you wish to update the task '${task.title}' to `)) return;
			
			
			
			//this.#onStatusChange(task.id);
		});
		
		const removeButton = newTaskRow.querySelector("button");
		removeButton.addEventListener("click", () => {
			if (!window.confirm("Do you wish to delete this task?")) return;
			this.removeTask(task.id);				
			this.#deleteTaskCallback(task.id);
		})
		
        this.#taskList.querySelector("tbody").appendChild(newTaskRow);
    }

    /**
     * Update the status of a task in the view
     * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
     */
    updateTask(task) {
        /**
         * Fill inn the code
         */
    }

    /**
     * Remove a task from the view
     * @param {Integer} task - ID of task to remove
     */
    removeTask(id) {
		const taskRow = this.#taskList.querySelector(`[data-id='${id}']`);
		taskRow.remove();
    }

    /**
     * @public
     * @return {Number} - Number of tasks on display in view
     */
    getNumtasks() {
		return this.#taskList.querySelectorAll("[data-id]").length;
    }
}
customElements.define('task-list', TaskList);
