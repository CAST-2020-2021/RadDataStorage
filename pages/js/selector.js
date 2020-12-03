let c;
let ctx;
const img = new Image();

const floorselect = document.getElementById('floors');

window.onload = () => {
    c = document.getElementById('imageCanvas');
    ctx = c.getContext('2d');
    img.onload = () => {
        ctx.drawImage(img, 0, 0, img.width, img.height,
            0, 0, c.width, c.height);
    };
    img.src = 'assets/sample.jpeg';
};

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xinput = document.getElementById('inputX');
    const yinput = document.getElementById('inputY');

    xinput.value = x;
    yinput.value = Math.floor(y);
}
// eslint-disable-next-line no-unused-vars
function updatefloorImg() {
    console.log('hello');
    console.log(floorselect);
    img.src = `assets/${floorselect.value}.png`;
    console.log(img.src);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, c.width, c.height);
}

const canvas = document.getElementById('imageCanvas');
canvas.addEventListener('mousedown', (e) => {
    getCursorPosition(canvas, e);
});
