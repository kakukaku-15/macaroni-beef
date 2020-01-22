// pixi.jsのアプリケーションを作成
const app = new PIXI.Application();

// bodyにpixi.jsのview(ステージ)を追加する
document.body.appendChild(app.view);

// Set the game state
let state = play;

// jump
let jumpflag = 0;    // ジャンプ中は1
const jump_speed = [];
for (i = 0; i <= 40; i++) {
    jump_speed[i] = 10 - (0.5 * i);    // ジャンプスピードの計算
}

const player_image = PIXI.Texture.from('img/bunny.png');
const macaroni_image = PIXI.Texture.from('img/pasta_macaroni.png');

const player = new PIXI.Sprite(player_image);
const macaroni = new PIXI.Sprite(macaroni_image);

// グラフィックオブジェクトの作成
const square = new PIXI.Graphics();
player.position.set(100, 500)
player.vx = 0;
player.vy = 0;
// グラフィックオブジェクトの設定
square.width = 100;     // 横幅の設定
square.height = 100;    // 縦幅の設定
square.x = 0;
square.y =  550;
// グラフィックオブジェクトの塗りつぶし設定
square.beginFill(0x006400);    // 指定の色で塗りつぶし開始準備
square.drawRect(0,0,1000,100);  // 矩形を描写する
square.endFill();              // 塗りつぶしを完了する

macaroni.position.set(100, 300)
macaroni.scale.set(0.1)

let items = new PIXI.Container();
let ground = new PIXI.Container();

items.addChild(macaroni)
ground.addChild(square)

app.stage.addChild(player);
app.stage.addChild(items);
app.stage.addChild(ground);

const keyboard = keyCode => {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
  
    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
}

//Capture the keyboard arrow keys
let space = keyboard(32),
    ctrl = keyboard(17);
space.press = () => {
    //console.log("up!");
    jump(player, jumpflag);
    //player.vy = -5;
    player.vx = 0;
};

ctrl.press = () => {
    items.x -= 1;
}

space.release = () => {
    player.vy = 0;
};

const animate = () => {
    requestAnimationFrame(animate); // 次の描画タイミングでanimateを呼び出す
    player.y += player.vy
    app.render(app.stage);   // 描画する
    collision(player, macaroni);
}

requestAnimationFrame( animate );

function play(delta) {

    //Move the cat 1 pixel to the right each frame
    // cat.vx = 1
    // cat.x += cat.vx;
}

function collision(player, item) {
    // console.log(player.y, item.y)
    if(player.y === item.y) {
        console.log("hit");
    }
}

function jump(player) {
    if (jumpflag == 0) {
        console.log("jump!");
        jumpflag = 1 ;
        var count = 0;
        var id = setInterval(function() {
            player.y -= jump_speed[count];
            if (count++ >= 40) {
                clearInterval(id);
                jumpflag = 0; 
            }
        }, 50);
    }
}
