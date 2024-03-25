const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const _canvasW = canvas.width = 600;
const _canvasH = canvas.height = 150;

// initialize sprite
const sprite = new Image();
sprite.src = "AnimationSheet_Character.png";
const _spriteW = 32;
const _spriteH = 32;
let spriteStateControl = 'idle';
let spriteFlipControl = false;

// animation frames
let frameSpeed = 0;     //frame speed basis
const frameControl = 8; //control the speed of the animation
const spriteAnimations = [];
const spriteState = [
    {
        name: 'idle',
        frames: 2
    },{
        name: 'idle2',
        frames: 2
    },{
        name: 'walk',
        frames: 4
    },{
        name: 'run',
        frames: 8
    },{
        name: 'crouch',
        frames: 6
    },{
        name: 'jump',
        frames: 8
    },{
        name: 'vanish',
        frames: 3
    },{
        name: 'ko',
        frames: 8
    },{
        name: 'attack',
        frames: 8
    },
    // flipped
    {
        name: 'idle-flipped',
        frames: 2
    },{
        name: 'idle2-flipped',
        frames: 2
    },{
        name: 'walk-flipped',
        frames: 4
    },{
        name: 'run-flipped',
        frames: 8
    },{
        name: 'crouch-flipped',
        frames: 6
    },{
        name: 'jump-flipped',
        frames: 8
    },{
        name: 'vanish-flipped',
        frames: 3
    },{
        name: 'ko-flipped',
        frames: 8
    },{
        name: 'attack-flipped',
        frames: 8
    }
];

spriteState.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let i = 0; i < state.frames; i++){
        let posX = i * _spriteW;
        let posY = index * _spriteH;
        
        frames.loc.push({x: posX, y: posY});
    }
    
    spriteAnimations[state.name] = frames;
});

// sprite movement
let speedX = 0;
let speedY = 0;
const jumpHeight = -16;
const gravity = 1;
const _canvasFloor = _canvasH - _spriteH;

// sprite run loop
let runAround = () => {
    var pos = speedX++;
    frameY = 3;
    if(pos > (_canvasW - _spriteW)){
        speedX = 0;
    }
    
    console.log(pos)
    return pos;
}

window.addEventListener('keydown', function(evt){
    console.log(evt.keyCode)
    switch(evt.keyCode){
        case 65:
            speedX -= 3;
            spriteStateControl = 'run-flipped';
            spriteFlipControl = true;
            break;
        
        case 68:
            speedX += 3;
            spriteStateControl = 'run';
            spriteFlipControl = false;
            break;
        
        case 32:
            spriteFlipControl ? spriteStateControl = 'jump-flipped' : spriteStateControl = 'jump';
            speedY -= 15;
            if(speedY < -15) speedY = -15;
            break;
        case 69:
            spriteFlipControl ? spriteStateControl = 'attack-flipped' : spriteStateControl = 'attack';
            break;
        case 83:
            spriteFlipControl ? spriteStateControl = 'crouch-flipped' : spriteStateControl = 'crouch';
            break;
        case 81:
            spriteFlipControl ? spriteStateControl = 'ko-flipped' : spriteStateControl = 'ko';
            break;
        case 90:
            speedX -= 1;
            spriteStateControl = 'walk-flipped';
            spriteFlipControl = true;
            break;
        case 88:
            spriteFlipControl ? spriteStateControl = 'vanish-flipped' : spriteStateControl = 'vanish';
            break;
        case 67:
            speedX += 1;
            spriteStateControl = 'walk';
            spriteFlipControl = false;
            break;
        default:
            spriteFlipControl ? spriteStateControl = 'idle-flipped' : spriteStateControl = 'idle';
            break;
    }
    disLog();
}, false);

window.addEventListener('keyup', function(evt){
    spriteFlipControl ? spriteStateControl = 'idle-flipped' : spriteStateControl = 'idle';
})

/**
* Realtime Logs
*/

let disLog = () => {
    let list = document.querySelector('ul');
    
    list.children[0].innerHTML = "Position X: " + (((_canvasW / 2) - _spriteW) + speedX);
    list.children[1].innerHTML = "Position Y: " + speedY;
    list.children[2].innerHTML = "Speed X: " + speedX;
    list.children[3].innerHTML = "Jump Limit: " + (_canvasFloor + gravity);
    list.children[4].innerHTML = "Gravity: " + gravity;
    list.children[5].innerHTML = "Canvas Floor: " + _canvasFloor;
}

/**
* Animation starts here
*/

// run sprite animation
let animate = () => {
    ctx.clearRect(0, 0, _canvasW, _canvasH);
    let framePos = Math.floor(frameSpeed/frameControl) % spriteAnimations[spriteStateControl].loc.length; // libog ni ayaw nako pa note ta
    let frameX = _spriteW * framePos;
    let frameY = spriteAnimations[spriteStateControl].loc[framePos].y; 
    
    // ctx.strokeStyle = "Red";
    // ctx.strokeRect((_canvasW / 2) - _spriteW, _canvasH - _spriteH, _spriteW, _spriteH);
    
    ctx.save();                                             // save canvas context
    // ctx.scale(-1, 1);                                    // flip the canvas
    ctx.drawImage(              
        sprite,                                             // sprite
        frameX,                                             // sprite animation frame row
        frameY,                                             // sprite animation frame column
        _spriteW,                                           // sprite width (negative to flip the sprite)
        _spriteH,                                           // sprite height
        ((_canvasW / 2) - _spriteW) + speedX,               // sprite position X (negative to flip the sprite || replace with runAround() function to loop running)
        // - computation to center sprite: (canvas width / 2) - sprite width + speedX
        // - computation to flip sprite: (canvas width / 2) * -1
        (_canvasFloor + speedY) + gravity,               // sprite position Y
        _spriteW,                                           // sprite position width
        _spriteH                                            // sprite position height
        );
        // ctx.restore();                                       // restore context
        
        // logPos();
        speedY ++;
        if((_canvasFloor - speedY) < _canvasFloor){
            speedY = 0;
        }
        frameSpeed++;
        disLog();
        requestAnimationFrame(animate);
    }
    animate();