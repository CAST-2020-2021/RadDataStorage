window.onload = function () {
    const c = document.getElementById('imageCanvas');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height, // source rectangle
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
    console.log(`x: ${x} y: ${y}`);
}

const canvas = document.getElementById('imageCanvas');
canvas.addEventListener('mousedown', (e) => {
    getCursorPosition(canvas, e);
});
