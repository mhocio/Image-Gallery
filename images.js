const numberOfImages = 13;

const gallery = document.querySelector('.gallery')
const overlay = document.querySelector('.overlay')
const overlayImage = overlay.querySelector('img')
const overlayClose = overlay.querySelector('.close')
const overlayInner = overlay.querySelector('.overlay-inner')

var image_opened = false;
const pathToImages = "images/"

/*generate div with img and button*/
function generateHTML([h, v]) {
    return `
      <div class="item h${h} v${v}">
        <img src=${pathToImages}/${randomNumber(numberOfImages)}.jpg>
        <div class="item__overlay">
          <button class="view">View →</button>
        </div>
      </div>
      `;
}


window.onscroll = function () { updateScrollIndicator() };

function updateScrollIndicator() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}


var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function randomNumber(limit) {
    return Math.floor(Math.random() * limit) + 1;
}

function handleClick_image(e) {
    const src = e.currentTarget.querySelector('img').src;
    overlayImage.src = src;
    open_image();
}


function open_image() {
    //openFullscreen();
    overlay.classList.add('open');
    image_opened = true;
}

function close_image() {
    //closeFullscreen();
    overlay.classList.remove('open');
    image_opened = false;
}

function showNextImage() {
    /* get only the number of image */
    const current_image = overlay.querySelector('img').src.split("/").pop().split(".")[0];
    overlayImage.src = pathToImages + (parseInt((current_image % numberOfImages) + 1)).toString() + ".jpg";
}

function showPrevImage() {
    /* get only the number of image */
    const current_image = overlay.querySelector('img').src.split("/").pop().split(".")[0];
    var next_image;

    if (current_image != 1) {
        next_image = parseInt(current_image - 1)
    } else {
        next_image = numberOfImages;
    }

    overlayImage.src = pathToImages + next_image.toString() + ".jpg";
}

const digits = Array.from({ length: 20 }, () => [randomNumber(2) * 2, randomNumber(2) * 2].concat(
    [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1],
    [1, 2], [1, 2][1, 2]]))

const html = digits.map(generateHTML).join('');

overlay.addEventListener('click', function (event) {

    if (event.target.querySelector('.overlay-inner') != null) {
        close_image();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (image_opened)
        if (key === 'Escape' || key === 'Esc' || key === 27) {
            close_image();
        }
        else if (key === 'ArrowRight' || key === 39) {
            showNextImage();
        }
        else if (key === 'ArrowLeft' || key === 37) {
            showPrevImage();
        }

});


window.onload = function () {
    gallery.innerHTML = html;

    const items = document.querySelectorAll('.item');

    items.forEach(item => item.addEventListener('click', handleClick_image));

    overlayClose.addEventListener('click', close_image);
};