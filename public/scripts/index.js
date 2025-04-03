const nav = document.querySelector('nav')

window.onscroll = e=>{
    if(scrollY > 1){
        nav.classList.add('moved-nav');
    }else{
        nav.classList.remove('moved-nav')
    }
}

const navControls = document.getElementById('nav-mb-controls')
navControls.onclick = e=>{
    document.getElementById('nav-right').classList.toggle('mb-hidden')
    for(let child of navControls.children){
        child.classList.toggle('mb-hidden')
    }
}


// Get the header-left div element
const headerLeft = document.getElementById('header-left');

// Define an array of image objects
function createImg(url, alt){
    const img = document.createElement('img');
    img.src = 'images/'+url;
    img.alt = alt;
    return img;
}
const images = [
    {"name":"Secure payment","url":"pexels-photo-6700403.png"},
    {"name":"Work for trusted clients","url":"pexels-photo-8374479.png"},
    {"name":"Work with professionals","url":"pexels-photo-8761538.png"},
    {"name":"Work from home","url":"pexels-photo-4995752.png"}
].map(({name, url})=>{
    return {img:createImg(url, name),name};
});


// Set the initial index to zero
let currentIndex = 0;

// Define a function to show the next image
function showNextImage() {
    const container = document.createElement('div')
    container.classList.add('header-left-container')

    // Create a new image element
    const img = images[currentIndex].img;
    
    container.appendChild(img);

    const descriptor = document.createElement('p');
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fa-solid', 'fa-circle-check');
    descriptor.append(checkIcon)

    const span = document.createElement('span')
    span.innerText = images[currentIndex].name
    descriptor.appendChild(span)
    
    container.appendChild(descriptor)

    headerLeft.appendChild(container)

    if (headerLeft.childElementCount > 1) {
        headerLeft.removeChild(headerLeft.firstElementChild);
    }
    // Increment the index

    

    currentIndex++;
    // If the index is equal to the length of the images array, set it back to zero
    if (currentIndex === images.length) {
        currentIndex = 0;
    }
    // Wait for 3 seconds, then show the next image
    setTimeout(showNextImage, 15000);
}

// Show the first image
showNextImage();


document.querySelectorAll('.qa-controls').forEach(element=>{
    element.onclick=()=>{
        let children = [...element.children, element.previousElementSibling.lastElementChild];

        children.forEach(child=>{
            child.classList.toggle('hidden')
        })
       
    }
})

