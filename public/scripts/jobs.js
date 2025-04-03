const scrollBtns = document.querySelector('.popular-types-control').getElementsByTagName('button');
const scrollRight = scrollBtns[1]
const scrollLeft = scrollBtns[0]

scrollLeft.onclick = function scrollLeftEnd() {
    const container = document.querySelector('.popular-types-container');
    container.scrollTo({ left: 0, behavior: 'smooth' });
}

scrollRight.onclick = function scrollRightEnd() {
    const container = document.querySelector('.popular-types-container');
    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollTo({ left: maxScroll, behavior: 'smooth' });
}
document.querySelector('.popular-types-container').addEventListener('scroll', (e) => {
    const container = document.querySelector('.popular-types-container');
    const maxScroll = container.scrollWidth - container.clientWidth - 1;
    const left = container.scrollLeft
    scrollRight.disabled = false;
    scrollLeft.disabled = false;
    if (left <= 1) {
        scrollLeft.disabled = true
    } else if (left >= maxScroll) {
        scrollRight.disabled = true
    }
})

document.querySelectorAll('.article-type').forEach(article=>{
    article.addEventListener('click', ()=>{
        location.href = '/jobs?query='+article.innerText;
    })
})