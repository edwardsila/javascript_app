
const params = new URLSearchParams(window.location.search);
const job = params.get('job');
const proposalDetailsUrl = '/proposal'
function closeSpinner(){
    document.getElementById('spinner').style.display = 'none'
}
function openSpinner(){
    document.getElementById('spinner').style.display = '';
}
if(!job){
    location.href = '/404'
}
async function loadDetails(){
    const writer = JSON.parse(localStorage.getItem('writer'));
    const response  = await fetch('https://api.workhubwriters.com/job/id/'+job);

    const proposalRes = await fetch('https://api.workhubwriters.com/proposal/writer', {
        method: 'GET',
        headers: {
            'key':writer.accessKey,
            'user': writer._id
        }
    })
    const jobDetails = await response.json();
    const proposals = await proposalRes.json();

    const proposedJobsIds = proposals.map(({job})=>job)

    if(proposedJobsIds.includes(job)){
        alert( 'you have already made a proposal for this job. Redirecting to the proposal details', '.my-alert')
        location.href = proposalDetailsUrl+`?job=${job}`
    }
    
    console.log(jobDetails)
    try {
        
    const {price, title, description, expertiseLevel, timeExpected} = jobDetails;

    document.querySelector('.price').innerHTML = price;
    document.querySelector('.title').innerHTML =  title;
    document.querySelector('.description').innerHTML = description;
    document.querySelector('.experience-level').innerHTML  = expertiseLevel;
    document.querySelector('.duration').innerHTML = timeExpected
    } catch (error) {
        console.log(error)
    }
    closeSpinner()
}
if(job){
    loadDetails();
}

document.forms[0].addEventListener('submit', event=>{
    event.preventDefault();
    openSpinner()
    const formData = new FormData(document.forms[0]);
    formData.append('job', job)

    const writer = JSON.parse(localStorage.getItem('writer'));

    fetch('https://api.workhubwriters.com/proposal', {
        method: 'POST',
        body: formData,
        headers: {
            'key':writer.accessKey,
            'user': writer._id
        }
    }).then(d=>d.json())
    .then(e=>{
        location.href = proposalDetailsUrl;
    })
    closeSpinner()
})