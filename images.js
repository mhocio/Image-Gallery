const numberOfImages = 13;

const gallery = document.querySelector('.gallery')
const overlay = document.querySelector('.overlay')
var overlayImage = overlay.querySelector('img')
const overlayClose = overlay.querySelector('.close')
const overlayInner = overlay.querySelector('.overlay-inner')

var image_opened = false;
const pathToImages = "images/"

/*generate div with img and button*/
function generateHTML([h, v]) {
    return `
      <div class="item h${h} v${v}">
        <img class="lozad lazy" data-src=${pathToImages}/${nextnumber()}.jpg>
        <div class="item__overlay">
          <button class="view">View →</button>
        </div>
      </div>
      `;
}

current_number = 0;

function nextnumber()
{
    current_number = current_number + 1;
    return current_number;
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
    const current_image = overlay.querySelector('.overlay img.lozad').src.split("/").pop().split(".")[0];

    var next_image = parseInt((current_image % numberOfImages) + 1);

    if (images[next_image] == null) {
        var image = new Image();
        image.src = pathToImages + next_image.toString() + ".jpg";
        
        overlayImage.src = image.src;
        images[next_image] = image;
    } else {
        overlayImage.src = images[next_image].src;
    }
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

    //overlayImage.src = pathToImages + next_image.toString() + ".jpg";

    if (images[next_image] == null) {
        var image = new Image();
        image.src = pathToImages + next_image.toString() + ".jpg";
        
        overlayImage.src = image.src;
        images[next_image] = image;
    } else {
        overlayImage.src = images[next_image].src;
    }
}

const digits = Array.from({ length: numberOfImages }, () => [randomNumber(2) * 2, randomNumber(2) * 2].concat(
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

var images = new Array(numberOfImages + 1);

function loadImage(e) {
    var number = e.currentTarget.src.split("/").pop().split(".")[0];
    console.log(number);

    images[number] = e.currentTarget;
    console.log(images[number]);
}

window.onload = function () {
    gallery.innerHTML = html;

    var lazyloadImages;    
  
    if ("IntersectionObserver" in window) {
      lazyloadImages = document.querySelectorAll(".lazy");
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var image = entry.target;
            
            var number = image.dataset.src.split("/").pop().split(".")[0];
            if (images[number] != null) {
                image.src = images[number].src;
            } else {
                image.src = image.dataset.src;
            } 

            image.classList.remove("lazy");
            imageObserver.unobserve(image);
          }
        });
      });
  
      lazyloadImages.forEach(function(image) {
        imageObserver.observe(image);
      });
    } else {  
      var lazyloadThrottleTimeout;
      lazyloadImages = document.querySelectorAll(".lazy");
      
      function lazyload () {
        if(lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }    
  
        lazyloadThrottleTimeout = setTimeout(function() {
          var scrollTop = window.pageYOffset;
          lazyloadImages.forEach(function(img) {
              if(img.offsetTop < (window.innerHeight + scrollTop)) {
                
                var number = image.dataset.src.split("/").pop().split(".")[0];
                if (images[number] != null) {
                    image.src = images[number].src;
                } else {
                    image.src = image.dataset.src;
                } 

                img.classList.remove('lazy');
              }
          });
          if(lazyloadImages.length == 0) { 
            document.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
          }
        }, 20);
      }
  
      document.addEventListener("scroll", lazyload);
      window.addEventListener("resize", lazyload);
      window.addEventListener("orientationChange", lazyload);
    }

    var imagesArray = this.document.querySelectorAll('.item img');
    imagesArray.forEach(image => image.addEventListener('load', loadImage));

    const items = document.querySelectorAll('.item');
    items.forEach(item => item.addEventListener('click', handleClick_image));

    overlayClose.addEventListener('click', close_image);


    var imageDisplayed = document.querySelector('.overlay')
    var manager = new Hammer.Manager(imageDisplayed);
    var Swipe = new Hammer.Swipe();
    manager.add(Swipe);

    manager.on('swipe', function(e) {
        console.log(e.offsetDirection);
        console.log(e.deltaX);

        if (e.offsetDirection == 2) {
            showNextImage();
        } else if (e.offsetDirection == 4) {
            showPrevImage();
        }
    });


    //const observer = lozad(); // lazy loads elements with default selector as '.lozad'
    //observer.observe();
};