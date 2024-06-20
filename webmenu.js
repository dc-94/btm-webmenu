const $drowdownArrow = document.querySelector('.ri-menu-fold-line');
const $checkbox = document.getElementById('openDropdown');
const $dropdownMenu = document.querySelector('.dropdown-menu');

$checkbox.addEventListener('change', () => {
  $drowdownArrow.classList.toggle('rotate-dropdown-arrow');
});

$dropdownMenu.addEventListener('click', (e) => {
  $checkbox.checked = true;
  $checkbox.dispatchEvent(new Event('change'));
});




function resizeIframe() {
  var iframe = document.getElementById('formIframe');
  iframe.style.height = window.innerHeight - document.querySelector('header').offsetHeight + 'px';
}

window.addEventListener('resize', resizeIframe);
window.addEventListener('load', resizeIframe);