const _ = require('lodash')
const ipc = require('electron').ipcRenderer;
const cmd = require('node-cmd');

let intranetPath;

const choosePathBtn = document.getElementById('choosePathBtn');
const pathInput = document.getElementById('pathInput');
const pathGroup = document.getElementById('pathGroup');
const createBtn = document.getElementById('createBtn');
const sourceBranchInput = document.getElementById('sourceBranchInput');
const sourceBranchGroup = document.getElementById('sourceBranchGroup');
const macroBranchInput = document.getElementById('macroBranchInput');
const macroBranchGroup = document.getElementById('macroBranchGroup');
const versionCheckbox = document.getElementById('versionCheckbox');
const versionInput = document.getElementById('versionInput');
const versionGroup = document.getElementById('versionGroup');

// Button : choose path
choosePathBtn.addEventListener('click', function() {
    ipc.send('open-file-dialog');

    ipc.on('selected-directory', function(event, path) {
        document.getElementById('pathInput').value = path;
        intranetPath = path[0];
    });
});

// Button : Create branches
ipc.on('remove-class-m-progress', function() {
    clearForm()
});

createBtn.addEventListener('click', function() {
    clearForm()
    if (isNotValid(pathInput.value)) {
        pathGroup.classList.add('has-error');
        return false
    }
    if (isNotValid(sourceBranchInput.value)) {
        sourceBranchGroup.classList.add('has-error');
        return false
    }
    if (isNotValid(macroBranchInput.value)) {
        macroBranchGroup.classList.add('has-error');
        return false
    }

    createBtn.classList.add('m-progress');
    const sourceBranch = sourceBranchInput.value;
    const macroBranch = macroBranchInput.value;
    const hasVersion = versionCheckbox.checked;
    const version = versionInput.value;

    const data = {
        intranetPath: intranetPath,
        sourceBranch: sourceBranch,
        macroBranch: macroBranch,
        version: version,
        hasVersion: hasVersion
    }

    ipc.send('create-branches', data);
});

// Button : Version of all packages .json
document.getElementById('versionGroup').style.display = 'none';

document.getElementById('versionCheckbox').addEventListener('click', function() {
    versionGroup.style.display = this.checked ? 'block' : 'none';
});

// Utils
function isNotValid(entry) {
    return !(entry && entry.length > 0)
}

function clearForm() {
    pathGroup.classList.remove('has-error');
    sourceBranchGroup.classList.remove('has-error');
    macroBranchGroup.classList.remove('has-error');
    createBtn.classList.remove('m-progress');
}