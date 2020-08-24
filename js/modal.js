const portfolioContainer = document.querySelector('.cards_container')

portfolioContainer.addEventListener('click', e => {
    //console.log(e)
    e.preventDefault()

    const modalToggle = e.target.closest('.portfolio-link')
    //console.log(modalToggle)
    
    if(! modalToggle) return

    const modal = modalToggle.firstChild.nextElementSibling.nextElementSibling.nextElementSibling
    //console.log(modal)
    
    const closeButton = modal.querySelector('.modal-close')

    modal.classList.add('is-open')
    document.querySelector("body").style.overflow = 'hidden';

    closeButton.onclick = (e) => {
        modal.classList.remove('is-open')
        e.stopPropagation()
        document.querySelector("body").style.overflow = 'visible';
    }
})
