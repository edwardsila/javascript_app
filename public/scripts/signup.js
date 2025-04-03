const apiEndpoint = ''
const stepOneOptions = document.querySelectorAll('.step-one-option')
const root = document.documentElement;
const stepsElements = [...document.getElementsByClassName('step')]
var accountType = '';
const account = {
    name: '',
    email: '',
    phone: '',
    password:''
}

var spinner = '';

fetch('/images/loader.svg').then(d=>d.text()).then(e=>spinner = e);

const green = getComputedStyle(root).getPropertyValue('--green')
const orange = getComputedStyle(root).getPropertyValue('--orange')
const red = getComputedStyle(root).getPropertyValue('--pink')
stepOneOptions.forEach(option=>{
    option.addEventListener('click', event=>{
        document.getElementById('to-step-two').disabled = false
        stepOneOptions.forEach(element=>{
            element.querySelector('.selected').style.backgroundColor = '';
            element.querySelector('.selected').innerHTML ='';
            element.style.borderColor ='';
        })
        option.querySelector('.selected').innerHTML = '<i class="fa-solid fa-check"></i>'
        option.querySelector('.selected').style.backgroundColor=green
        option.style.borderColor = green
    })
})

let step = 0;

function updateStepDetails(){
    const bottomStepCounter = document.querySelectorAll('.step-count');

    document.getElementById('step-info').innerText = document.querySelectorAll('.step-count')[step].getAttribute('text');
    for(let i =0; i<step; i++){
        bottomStepCounter[i].classList.remove('active')
        bottomStepCounter[i].classList.add('done')
        bottomStepCounter[i].innerHTML = `<i class="fa-solid fa-check"></i>`
    }
    bottomStepCounter[step].classList.add('active')

}
function showStep(number){
    stepsElements.forEach(element=>{
        if(element.getAttribute('step') == number){
            element.classList.remove('hidden')
        }else{
            element.classList.add('hidden')
        }
    })
}
updateStepDetails();

const completeStep = {
    one(){
        const accountTypes = ['writer', 'client']
        const selectedAccount = [...document.querySelectorAll('.step-one-option')].map(e=>{
            return e.querySelector('.selected').innerHTML;
        })
        if(selectedAccount.join('') == ''){
            return null;
        }
        accountType = accountTypes[selectedAccount.indexOf(selectedAccount.filter(d=>d)[0])]
        showStep(2)
        
        step=1;
        return accountType;
    },
    two(){
        account.name = document.getElementById('name').value;
        account.email = document.getElementById('email').value;
        account.phone = document.getElementById('phone').value;
        showStep(3);
        step=2;
    },
    three(){
        showStep(4);
        step= 3;
    },
    four(){
        showStep(5);
        step=4;
        updateStepDetails()
    }
}

const nextStepButtons = {
    one: document.getElementById('to-step-two'),
}

nextStepButtons.one.onclick = e=>{
    if(nextStepButtons.one.disabled){
        return ;
    }
    completeStep.one()
    updateStepDetails();
}
document.getElementById('basic-info').addEventListener('submit', event=>{
    event.preventDefault();
    completeStep.two();
    updateStepDetails()
})

const passwordStrength=pwd=>{
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
    if(strongPassword.test(pwd)){
        return {color:green, message:"Password OK", icon: '<i class="fa-regular fa-circle-check" ></i>'}
    }else if(mediumPassword.test(pwd)){
        return {color:orange, message:"Average password", icon:'<i class="fa-solid fa-circle-exclamation"></i>'};
    }else {
        return {color:red, message:"Weak password", icon:'<i class="fa-solid fa-triangle-exclamation"></i>'};
    }
}

const pwdInput = document.getElementById('password')
const pwdConfirm = document.getElementById('pwd')
pwdInput.addEventListener('keyup', event=>{
    const {message, color, icon} = passwordStrength(pwdInput.value);
    const pwdStrength = document.querySelector('.pwd-strength');
    pwdStrength.innerHTML = `${icon} <span>${message}</span>`
    pwdStrength.getElementsByTagName('i')[0].style.color = color;
})

pwdConfirm.addEventListener('keyup', event=>{
    const pwdMatch = document.querySelector('.pwd-match');
    if(!pwdConfirm.value){
        pwdMatch.innerHTML = `<i class="fa-regular fa-circle"></i> <span>Match the passwords</span>`
        pwdMatch.getElementsByTagName('i')[0].style.color='';
    }else if (pwdConfirm.value != pwdInput.value){
        pwdMatch.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> <span>The passwords do not match</span>`
        pwdMatch.getElementsByTagName('i')[0].style.color=red
    }else{
        pwdMatch.innerHTML = `<i class="fa-regular fa-circle-check" ></i> <span>The passwords match success</span>`
        pwdMatch.getElementsByTagName('i')[0].style.color=green
    }
})


function createMessageBar(){
    const container = document.createElement('div');
    const iconContainer = document.createElement('div');
    const content = document.createElement('div');
    const closeMsgBox = document.createElement('div');
    const closeMsgBoxIcon  = document.createElement('i');

    closeMsgBoxIcon.style.color = 'white';
    closeMsgBoxIcon.style.fontSize = '1rem';
    iconContainer.style.fontSize = '1rem';
    
    closeMsgBoxIcon.classList.add('fa-solid', 'fa-xmark');
    closeMsgBoxIcon.style.fontSize = '1.5rem';
    closeMsgBox.append(closeMsgBoxIcon);

    container.append(iconContainer, content, closeMsgBox);
    container.classList.add('hidden');

    const styles =[
        {
            position: 'fixed',
            top:0,
            right:0,
            width: '100vw',
            height: '100vh',
            padding: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 8fr 1fr',
            transition: 'ease 400ms',
            zIndex: 200,
            backgroundColor: '#00000080',
            backdropFilter: 'blur(10px)',
            margin:'0px auto'
        },
        {
            textAlign: 'center',
            width: 'fit-content',
            overflowY: 'hidden',
            margin: 'auto',
            padding: '20px 10px',
            backgroundColor: 'white',
            borderRadius: '5px'
        }
    ]
    function loadStyles(element, styles){
        for(let style in styles){
            element.style[style] = styles[style];
        }
    }

    loadStyles(container, styles[0]);
    loadStyles(content, styles[1]);
    return {
        container,
        iconContainer, 
        content, 
        closeMsgBox
    };
}

let messageBoxElements = createMessageBar();
document.body.append(messageBoxElements.container);
function closeMsgBox(){
    messageBoxElements.container.classList.add('hidden')
}
messageBoxElements.closeMsgBox.onclick = closeMsgBox;

function message(information, color, icon){
    let {
        container,
        iconContainer, 
        content
    } = messageBoxElements;

    iconContainer.innerHTML = icon;
    content.innerHTML=information;
    content.style.color=color;
    container.style.color = color;
    //container.style.backgroundColor= 'white';
    container.classList.remove("hidden");
}



function warn(msg){
    message(msg, "orange", '<i class="fa-solid fa-triangle-exclamation"></i>');
}

function inform(msg){
    message(msg, green, '<i class="fa-solid fa-circle-info fa-beat-fade" style="--fa-beat-fade-opacity: 0.67; --fa-beat-fade-scale: 1.075;" ></i>');
}

function _error(msg){
    message(msg, 'red', '<i class="fa-solid fa-triangle-exclamation fa-fade"></i>');
}
function _loading(){
    message('<img src="/images/loader.svg"/>', green, '<i class="fa-solid fa-spinner fa-spin"></i>')
}

document.getElementById('password-form').addEventListener('submit', event=>{
    event.preventDefault();
    if(pwdInput.value == pwdConfirm.value){
        account.password = pwdInput.value;

        completeStep.three()
        updateStepDetails()
    }else{
        return;
    }
})


async function createAccount(url){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // editing user data
    account.name =  account.name.split(' ').map(e=>{
        let str = e.split('');
        str[0] = str[0].toUpperCase();
        return str.join('');
    }).join(' ');
    account.email = account.email.toLowerCase();

    const raw = JSON.stringify(account);
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const link = apiEndpoint + url;
        const response = await fetch(link, requestOptions);
        
        const result = await response.text();
        if (!response.ok) {
            return  true;
        }
        return true;
    } catch (error) {
        return false
    }
}
const create = {
    async client() {
      const acc = await createAccount('/client');
      if(acc._id){
        localStorage.setItem('client', JSON.stringify(acc))
      }
      
      return acc
    },
    async writer() {
        const acc = await createAccount('/account/create');
        location.href = '/'
        return acc
    }
};

async function saveUser(){
    completeStep.four();
    if(accountType == 'writer'){
        return await create.writer()
    }else if(accountType == 'client'){
        return await create.client()
    }else{
        return;
    }
}
document.getElementById('four').getElementsByTagName('input').namedItem('accept-tnc').addEventListener('change', event=>{
    if(event.target.checked){
        document.getElementById('create-btn').disabled = false;
    }else{
        document.getElementById('create-btn').disabled = true
    }
})
document.getElementById('create-btn').addEventListener('click',async ()=>{
    await saveUser();
    
})

function showResults(resolve, error){
    const five =  document.getElementById('five')
    const load = five.querySelector('.loader')
    const errorElement = five.querySelector('.error')
    const success = five.querySelector('.success')
    const arr = [load, errorElement, success];
    if(resolve) {
        if(result){
            arr.forEach(d=>d.classList.add('hidden'))
            success.classList.remove('hidden')
        }

    } else{
        arr.forEach(d=>d.classList.add('hidden'))
        errorElement.classList.remove('hidden')
        document.getElementById('error-message').innerText = JSON.stringify(error, null, 4);
    }
}

function reportAccountCreation(){
    
}