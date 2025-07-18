const { app, dialog } = require("electron");
const path = require('path');
const { rename, readdir, copyFile } = require('fs/promises');

async function editName(event, editData) {
	try {
		const editPath = path.join(app.getPath(editData.targetDir), "Swan MP");
		const collections = (await readdir(editPath, {withFileTypes: true})).filter(col => col.isDirectory());

		// Throw error when name is empty
		if(editData.newName === "") {
			throw new Error("empty");
		};

		// Return function early when old name and new name are the same
		if(editData.newName === editData.oldName) {			
			return;
		};

        // Throw error when a folder with the same name aleady exists
       	if(collections.some(col => col.name === editData.newName)) {
            throw new Error("exists");
        };

		// Rename corresponding folder
		await rename(path.join(editPath, editData.oldName), path.join(editPath, editData.newName));

		return "edited";
	} catch (error) {
		console.log(error);
		return error.message;
	};
};

async function editCover(event, editData) {
	try {
		const res = await dialog.showOpenDialog({properties: ["openFile"]});
		const imgPath = res.filePaths[0];

		if(res.canceled) return;

		// Check for correct file format
		if(!imgPath.endsWith("jpg") && !imgPath.endsWith("jpeg") && !imgPath.endsWith("png")) {
			throw new Error("format");
		};

		//Edit image
		await copyFile(imgPath, path.join(app.getPath(editData.targetDir), "Swan MP", editData.name, "coverImg.png"));

		return "edited";
	} catch (error) {
		console.log(error);
		return error.message;
	};
};

module.exports = { editName, editCover };