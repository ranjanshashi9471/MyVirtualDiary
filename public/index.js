// Get references to DOM elements
const addEntryButton = document.getElementById('add-entry');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const titleInput = document.getElementById('input-title');
const contentInput = document.getElementById('input-content');
const editTitleInput = document.getElementById('edit-input-title');
const editContentInput = document.getElementById('edit-input-content');
const saveEntryButton = document.getElementById('save-entry');
const cancelEntryButton = document.getElementById('cancel-entry');
const cancelEditEntryButton = document.getElementById('cancel-edit-entry');
const saveEditEntryButton = document.getElementById('save-edit-entry');
const id = document.getElementById("edit-modal-id");
const entryContainer = document.getElementsByClassName('entry');


cancelEntryButton.style.backgroundColor="transparent";
cancelEditEntryButton.style.backgroundColor="transparent";
// Function to show the modal
function showModal() {
    modal.style.display = 'block';
    titleInput.value = '';
    contentInput.value = '';
}

// Function to hide the modal
function hideModal() {
    modal.style.display = 'none';
}

// Event listener for the add entry button
addEntryButton.addEventListener('click', () => {
    showModal();
});

// Event listener for the save entry button

saveEntryButton.addEventListener('click', () => {
    const title = titleInput.value;
    const content = contentInput.value;
    console.log(title +"  "+content);

    if (title.trim() === '' || content.trim() === '') {
        alert('Please enter a title and content for your diary entry.');
    }else{
        hideModal();
        document.getElementById("addEntryForm").submit();
    }
});

// Event listener for the cancel entry button
cancelEntryButton.addEventListener('click', () => {
    hideModal();
});

//--------------------Editing Code----------------------------------------//

saveEditEntryButton.addEventListener('click', () => {
    const title = editTitleInput.value;
    const content = editContentInput.value;
    console.log(title +"  "+content);

    if (title.trim() === '' || content.trim() === '') {
        alert('Please enter a title and content for your diary entry.');
    } else {
        hideEditModal();
        document.getElementById("editEntryForm").submit();
    }
});

for(let i=0;i<entryContainer.length;i++){
    entryContainer[i].addEventListener('click',()=>{
        showEditModal(i);
    });
}

function showEditModal(i) {
    document.getElementById("edit-modal").style.display = 'block';
    editTitleInput.value = entryContainer[i].children[0].innerHTML;
    editContentInput.value = entryContainer[i].children[1].innerHTML;
    id.value = entryContainer[i].children[3].value;
}

function hideEditModal() {
    document.getElementById("edit-modal").style.display = 'none';
}

cancelEditEntryButton.addEventListener("click",()=>{
    hideEditModal();
});

