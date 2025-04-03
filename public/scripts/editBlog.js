// Get a reference to the Quill editor
// Add fonts to whitelist
var Font = Quill.import('formats/font');
Font.whitelist = ['Quicksand', 'Nunito', 'Rubik', 'Neutra Text', 'Garamond', 'Times'];
Quill.register(Font, true);

var quill = new Quill('#editor', {
    modules: {
        imageResize: {
            displaySize: true
        },
        toolbar: {
            container: '#toolbar',
        },
        clipboard: {
            matchVisual: true
        }
    },
    placeholder: 'Your blog content goes here, start writing...',
    theme: 'snow'
});

// Get references to the elements by their IDs
const topicInput = document.getElementById('topicInput');
const addTopicButton = document.getElementById('addTopicButton');
const topicsContainer = document.getElementById('topicsContainer'); // Updated ID
var topicsArray = ["book review", "modern trends", "blog", "editorial"]; // Array to store topics

// Event handler for adding a new topic
addTopicButton.addEventListener('click', () => {
    const newTopic = topicInput.value.trim();
    if (newTopic !== '' && topicsArray.indexOf(newTopic) === -1) {
        topicsArray.push(newTopic); // Add to the array
        updateTopics();
        topicInput.value = ''; // Clear the input
    }
});

const checkInputAndUpdate = () => {
    const str = topicInput.value;
    const arr = str.split(',');
    if (arr.length > 1) {
        topicsArray.push(...arr.splice(0, arr.length - 1));
        topicInput.value = arr[0];
        updateTopics();
    }
}
topicInput.addEventListener('input', checkInputAndUpdate);
topicInput.onkeyup = event => {
    if (event.key == 'Enter') {
        const str = topicInput.value;
        topicsArray.push(str);
        topicInput.value = '';
        updateTopics();
    }
}

// Event delegation for removing topics
topicsContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const topicElement = event.target.closest('.topic');
        if (topicElement) {
            const topicText = topicElement.querySelector('span').textContent;
            const index = topicsArray.indexOf(topicText);
            if (index !== -1) {
                topicsArray.splice(index, 1); // Remove from the array
                updateTopics();
            }
        }
    }
});

function removeTopic(index) {
    topicsArray.splice(index, 1);
    updateTopics();
}

// Function to update the topics display
function updateTopics() {
    topicsContainer.innerHTML = ''; // Clear the container
    let index = 0;
    const s = new Set(topicsArray.map(d=>{
       try{
         return d.trim();
       }catch(err){
        return d;
       }
    }));
    topicsArray = [...s];
    topicsArray.forEach((topic) => {
        const topicElement = document.createElement('div');
        topicElement.classList.add('topic');
        topicElement.innerHTML = `
            <span>${topic}</span>
            <button onclick="removeTopic(${index++})">
                <i class="fas fa-xmark"></i>
            </button>
        `;
        topicsContainer.appendChild(topicElement);
    });

    const topicsCount = document.querySelector('.topics-count');
    topicsCount.querySelector('.topics-count').textContent = topicsArray.length;
    if (topicsArray.length < 6)
        topicsCount.classList.add('wh-danger');
    else
        topicsCount.classList.remove("wh-danger");
}

updateTopics();




function dataIsValid(){
    if(topicsArray.length < 5){
        return false;
    }

    const blogTitle = document.getElementById('blogTitle');
    if(blogTitle.value.length > 5){
        return false;
    }

    const editor = document.getElementById('editor');
    if(editor.innerText.length < 20){
        return false;
    }

    const excerpt = document.getElementById("excerpt");
    if(excerpt.value.length < 5){
        return false;
    }

    return true;
}


async function postBlog(){
    if(!dataIsValid()){
        return new Error('Form data not valid');
    }

    
}