const $drowdownArrow = document.querySelector('.ri-menu-fold-line');
const $checkbox = document.getElementById('openDropdown');
const $dropdownMenu = document.querySelector('.dropdown-menu');

$checkbox.addEventListener('change', () => {
  $drowdownArrow.classList.toggle('rotate-dropdown-arrow');
});

$dropdownMenu.addEventListener('click', (e) => {
  $checkbox.checked = false;
  // setting checked to false won't trigger 'change'
  // event, manually dispatch an event to rotate
  // dropdown arrow icon
  $checkbox.dispatchEvent(new Event('change'));
});

////////////////////


var btn2 = document.getElementById('btn2');
var btn3 = document.getElementById('btn3');
// var btn4 = document.getElementById('btn4');
// var menuSelection = 0;
// btn1.onclick = 
//   innerHTML=
//    <iframe src="menus/full-menu.pdf#toolbar=0">
//    </iframe>


//  if (btn1.onclick) {
//   document.getElementById('menu_file').innerHTML=(
//    <iframe src="menus/full-menu.pdf#toolbar=0" >
//    </iframe>)
//  }
//  else if (menuSelection == "2") {
//   document.getElementById('menu_file').innerHTML=
//    <iframe src="menus/full-menu.pdf#toolbar=0" >
//    </iframe>
// }else if (menuSelection == "3") {
//   document.getElementById('menu_file').innerHTML=
//    <iframe src="menus/full-menu.pdf#toolbar=0" >
//    </iframe>
// } else (menuSelection == "4") ;{
//   document.getElementById('menu_file').innerHTML=
//    <iframe src="menus/full-menu.pdf#toolbar=0" >
//    </iframe>
//    }