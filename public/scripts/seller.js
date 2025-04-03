const profile = document.querySelector('.profile');
const profileImage = document.querySelectorAll('.profile-image');
const profileInput = profile.querySelector('.profile-input');

profileImage.forEach(img=> img.addEventListener('click', () => {
  profileInput.click();
}));

profileInput.addEventListener('change', () => {
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.forEach(e=>e.src = reader.result);
    };
    
    reader.readAsDataURL(file);
  }
});


var dropdownBtn = document.querySelector('.active-jobs');
var dropdownContent = document.querySelector('.dropdown-jobs');

dropdownBtn.addEventListener('click', function() {
  dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

var dropdownDiv = document.querySelector('.pending-orders');
var dropdownProposals = document.querySelector('.dropdown-proposals');

dropdownDiv.addEventListener('click', function() {
  dropdownProposals.style.display = dropdownProposals.style.display === 'block' ? 'none' : 'block';
});

function generateDate(dateString){
  const [day, month, date, year]= new Date(dateString).toLocaleString('en-us', { 
       weekday: 'long', 
       month: 'long', 
       year: 'numeric', 
       day: 'numeric'
   }).split(',').join('').split(' ');
   return `${day}, ${date} ${month} ${year}`
}

function loadUserInfo(){
    document.querySelector('.writer-name').innerText = writer.name;
    document.querySelector('.writer-createdAt').innerHTML=generateDate(writer.createdAt);
    document.querySelector('.writer-description').innerText= writer?.description || 'New Member!';
    document.querySelector('.rating-figure').innerText = writer.rating;

    if(writer.skills.length){
      const skills = writer.skills.map(({name, level})=>{
       return `
        <div class="skill-item">
            <div class="skill-name">
              ${name}
            </div>
            <div class="skill-level">
                ${level}
            </div>
        </div>
        `
      }).join('')
      document.querySelector('.writer-skills').innerHTML = skills;
      document.querySelector('.current-skills').innerHTML = skills;
    }
}
onload = e=>{
    loadUserInfo();
};

const form0 = document.getElementById('form0');
const form1 = document.getElementById('form1');
const descriptionBar = document.querySelector('.writer-description');

[...document.forms].forEach(d=>{
  d.style.right = `${(innerWidth -  d.clientWidth)/2}px`;
})
onresize = ()=>{
  [...document.forms].forEach(d=>{
    d.style.right = `${(innerWidth -  d.clientWidth)/2}px`;
  })
    
};

form0.addEventListener('submit', event=>{
    event.preventDefault();
    closeForm0();
    descriptionBar.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color: var(--green)"></i>`;
    const text = document.getElementById('description-input');
    const formData = new FormData(form0);
    fetch('https://api.workhubwriters.com/account/updateAbout', {
        method: 'POST',
        headers: {
            'key': writer.accessKey,
            'user':writer._id
        },
        body: formData
    }).then(res=>{
        return res.json();
    }).then(d=>{
        descriptionBar.innerHTML = '';
        writer.description = d.description?d.description:writer.description;
        descriptionBar.innerText = d.description;
    }).catch(err=>{
        console.log(err)
    })
});

function closeForm0(){
    form0.classList.add('hidden')
}

function openForm0(){
    
    document.getElementById('description-input').value = writer.description;
    form0.classList.remove('hidden');
    form0.style.right = `${(innerWidth -  form0.clientWidth)/2}px`;

}

document.querySelector('.form0.close-description').onclick=e=>{
    e.preventDefault();
    closeForm0();
};

descriptionBar.onclick = openForm0;


form1.addEventListener('submit', event=>{
  event.preventDefault();
  form1.classList.add('hidden');
  const name = document.getElementById('skill_name').value;
  const level = document.getElementById('skill_level').value;
  const skills = [
    ...writer.skills,
    {name, level}
  ];
  fetch('https://api.workhubwriters.com/account/updateSkills', {
        method: 'POST',
        headers: {
            'key': writer.accessKey,
            'user':writer._id,
            "Content-Type":"application/json"
        },
        body: JSON.stringify({skills})
    }).then(res=>{
        return res.json();
    }).then(d=>{
        console.log(d)
    }).catch(err=>{
        console.log(err)
    })
})

document.querySelector('.form1.close-description').addEventListener('click', event=>{
  event.preventDefault();

  form1.classList.add('hidden')
})

function showForm1(){
  form1.classList.remove('hidden')
  form0.style.right = `${(innerWidth -  form0.clientWidth)/2}px`;
}

