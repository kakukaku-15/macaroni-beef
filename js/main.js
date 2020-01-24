// pixi.jsのアプリケーションを作成
const app = new PIXI.Application();

// bodyにpixi.jsのview(ステージ)を追加する
document.body.appendChild(app.view);

// jump
let jumpflag = 0;    // ジャンプ中は1
const jump_speed = [];
for (i = 0; i <= 40; i++) {
    jump_speed[i] = 10 - (0.5 * i);    // ジャンプスピードの計算
}

// Set the game state
let state = play;
let score = 0
let skill_point = 0
let scoreText = new PIXI.Text("SCORE: 0", {font: "24px/1.2 vt", fill: "red"});
scoreText.position.set(20, 20);
app.stage.addChild(scoreText);

const player_image = PIXI.Texture.from('img/bunny.png');
const macaroni_image = PIXI.Texture.from('img/pasta_macaroni.png');
const beef_image = PIXI.Texture.from('img/niku_gyu.png');
const skill_image = PIXI.Texture.from('img/seiza02_oushi.png');
const beem_image = PIXI.Texture.from('img/animal_bull_kowai.png');

const player = new PIXI.Sprite(player_image);
player.name = "player"
player.scale.set(0.1)
const skill = new PIXI.Sprite(skill_image);
const beem = new PIXI.Sprite(beem_image);
beem.name = "beem"

// グラフィックオブジェクトの作成
const square = new PIXI.Graphics();
player.position.set(10, 440)
player.vx = 0;
player.vy = 0;

skill.scale.set(0.1)
skill.position.set(750, 50)
skill.anchor.set(0.5)
skill.visible = false

// グラフィックオブジェクトの設定
square.width = 100;     // 横幅の設定
square.height = 100;    // 縦幅の設定
square.x = 0;
square.y =  518;
// グラフィックオブジェクトの塗りつぶし設定
square.beginFill(0x006400);    // 指定の色で塗りつぶし開始準備
square.drawRect(0,0,1000,100);  // 矩形を描写する
square.endFill();              // 塗りつぶしを完了する

let items = new PIXI.Container();

for(let i = 0; i < 100; i++) {
    let num = Math.floor(Math.random() * 10);
    let beef = Math.floor(Math.random() * 9);
    x = 90 + 40*i
    y = 400 + num*10
    if(beef == 1) {
        const beef = new PIXI.Sprite(beef_image);
        beef.scale.set(0.08)
        beef.position.set(x, y)
        beef.anchor.set(0.5)
        beef.name = "beef"
        items.addChild(beef)
        continue
    }
    const macaroni = new PIXI.Sprite(macaroni_image);
    macaroni.scale.set(0.1)
    macaroni.position.set(x, y)
    macaroni.anchor.set(0.5)
    macaroni.name = "macaroni"
    items.addChild(macaroni)
}

let ground = new PIXI.Container();

ground.addChild(square)

app.stage.addChild(player);
app.stage.addChild(items);
app.stage.addChild(ground);
app.stage.addChild(skill);

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

// Capture the keyboard arrow keys
let space = keyboard(32),
    ctrl = keyboard(17);

space.press = () => {
    jump(player, jumpflag);
    player.vx = 0;
};

ctrl.press = () => {
    if(skill_point > 0) {
        do_beem();
    }
}

space.release = () => {
    player.vy = 0;
};

const animate = () => {
    requestAnimationFrame(animate); // 次の描画タイミングでanimateを呼び出す
    player.y += player.vy
    app.render(app.stage);   // 描画する
    items.x -= 2
    if(skill_point > 0) {
        skill.visible = true
    }
    items.children.forEach(item => {
        collision(player, item);
        scoreText.text = "SCORE: " + score;
    })
}

requestAnimationFrame( animate );

function play(delta) {

    //Move the cat 1 pixel to the right each frame
    // cat.vx = 1
    // cat.x += cat.vx;
}

function collision(player, item) {
    if(player.y <= (items.toGlobal(item).y) && (player.y + player.height) >= (items.toGlobal(item).y) &&
       player.x <= (items.toGlobal(item).x) && (player.x + player.width) >= (items.toGlobal(item).x)) {
        console.log("hit");
        console.log(player.x, items.toGlobal(item).x, player.y, items.toGlobal(item).y)
        items.removeChild(item)
        score += 1 // ポイントを追加
        if(item.name == "beef" && player.name == "player") {
            skill_point += 1
        }
    }
    if(items.toGlobal(items.children[0]).x < 0) {
        items.removeChild(items.children[0])
    }
}

function jump(player) {
    if (jumpflag == 0) {
        jumpflag = 1 ;
        var count = 0;
        var id = setInterval(function() {
            player.y -= jump_speed[count];
            if (count++ >= 40) {
                clearInterval(id);
                jumpflag = 0; 
            }
        }, 40);
    }
}

function do_beem() {
    skill_point--;
    skill.visible = false
    beem.scale.set(0.2)
    beem.position.set(player.x, player.y)
    beem.anchor.set(0.5)
    app.stage.addChild(beem);
    requestAnimationFrame(beem_motion)
}

const beem_motion = () => {
    requestAnimationFrame(beem_motion);
    app.render(app.stage);
    beem.x += 4.8
    if(beem.x >= 700) {
        app.stage.removeChild(beem);
        return
    }
    items.children.forEach(item => {
        collision(beem, item)
    })
    shower_item()
}
