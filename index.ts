import {
  canvas,
  ctx,
  GameObject,
  Group,
  InputController,
  Util,
  Scene,
  Game,
} from './pico-planet';

import TopLeftPipeTile from './TLPipeTile.piskel.json';
import TopRightPipeTile from './TRPipeTile.piskel.json';
import TopLeftUpsideDownPipeTile from './TLUpsideDownPipeTile.piskel.json';
import TopRightUpsideDownPipeTile from './TRUpsideDownPipeTile.piskel.json';
import FlappyBird from './FlappyBird.piskel.json';
// Import stylesheets
import './style.css';

/* -------------------------------------------------------------------------- */
/*                               GAME SPECIFIC CODE                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GAME MECHANICS ---------------------------- */
const TILE_WIDTH: number = 32;
const TILE_HEIGHT: number = 32;
const GAP_DIFFICULTY: number = 4;
const SPEED: number = 1;
const GRAVITY: number = 2;
const FLAP_POWER: number = 30;
const COLOR_SCORE: string = '#fdbc16';
const COLOR_OUTLINE_SCORE: string = '#000';
const COLOR_GO_SCORE: string = '#fff';
const COLOR_OUTLINE_GO_SCORE: string = '#000';
const COLOR_TITLE: string = '#fdbc16';
const COLOR_OUTLINE_TITLE: string = '#000';
const FONT_SCORE: string = '32px Titillium Web';
const COLOR_BUTTON: string = '#F00';

/* --------------------------------- ENTITIES ------------------------------- */
class Pipe extends GameObject {
  private BRPipeTile =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHVJREFUWEdjlJnC8J+BAlDgBNE8YR+EhvFhRtaWQFjftzEwYrOGccg6gJDPaR4CA+4AmA8JOWQ0DdAsBAgFPc0T4WgaGPAoGHAHjKaBAY+CAXfAaBoY8CgYcAeMpoEBj4IBd8BoGhjwKBhwB4ymgQGPAmo5AABJAuAhmjuR3gAAAABJRU5ErkJggg==';

  private BLPipeTile =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAExJREFUWEdjZMABOL0Y/oOkmntQFUzYh8ovcMJlAnZ96OoZRx0wGgKjITAaAqMhMBoCoyEwGgKjITAaAqMhMBoCoyEwGgKjITDQIQAA3FDMQWPDHDsAAAAASUVORK5CYII=';

  private tall: number;

  // initial state
  constructor(_x: number, _placement: string, _tall?: number) {
    super();
    this.command = _placement;
    this.width = TILE_WIDTH * 2;
    this.height = _tall ? (_tall + 1) * TILE_HEIGHT : 1 * TILE_HEIGHT;
    this.x = _x;
    this.y = this.command == 'BOTTOM' ? canvas.height - this.height : 0;
    this.tall = _tall;
  }

  // update the state
  update() {
    super.update();

    this.x -= SPEED;
  }

  // display the results of state
  render() {
    super.render();

    if (this.command == 'BOTTOM') {
      // TL
      let tlPipe = Util.getTextureFromPiskel(TopLeftPipeTile);
      ctx.drawImage(tlPipe.image, this.x, this.y, tlPipe.width, tlPipe.height);

      // TR
      let trPipe = Util.getTextureFromPiskel(TopRightPipeTile);
      ctx.drawImage(
        trPipe.image,
        this.x + trPipe.width,
        this.y,
        trPipe.width,
        trPipe.height
      );

      for (let index = 0; index < this.tall; index++) {
        // BL
        let blPipe = new Image();
        blPipe.src = this.BLPipeTile;
        ctx.drawImage(
          blPipe,
          this.x,
          this.y + (index + 1) * TILE_HEIGHT,
          TILE_WIDTH,
          TILE_HEIGHT
        );

        // BR
        let brPipe = new Image();
        brPipe.src = this.BRPipeTile;
        ctx.drawImage(
          brPipe,
          this.x + TILE_WIDTH,
          this.y + (index + 1) * TILE_HEIGHT,
          TILE_WIDTH,
          TILE_HEIGHT
        );
      }
    } else if (this.command == 'TOP') {
      for (let index = 0; index < this.tall; index++) {
        // BL
        let blPipe = new Image();
        blPipe.src = this.BLPipeTile;
        ctx.drawImage(
          blPipe,
          this.x,
          this.y + index * TILE_HEIGHT,
          TILE_WIDTH,
          TILE_HEIGHT
        );

        // BR
        let brPipe = new Image();
        brPipe.src = this.BRPipeTile;
        ctx.drawImage(
          brPipe,
          this.x + TILE_WIDTH,
          this.y + index * TILE_HEIGHT,
          TILE_WIDTH,
          TILE_HEIGHT
        );
      }

      // TL
      let tlPipe = Util.getTextureFromPiskel(TopLeftUpsideDownPipeTile);
      ctx.drawImage(
        tlPipe.image,
        this.x,
        this.y + this.tall * tlPipe.width,
        tlPipe.width,
        tlPipe.height
      );

      // TR
      let trPipe = Util.getTextureFromPiskel(TopRightUpsideDownPipeTile);
      ctx.drawImage(
        trPipe.image,
        this.x + trPipe.width,
        this.y + this.tall * trPipe.width,
        trPipe.width,
        trPipe.height
      );
    }
  }
}

class PipePair extends Group {
  // initial state
  constructor(_x: number, _topTall?: number, _bottomTall?: number) {
    super();

    let topPipe = new Pipe(_x, 'TOP', _topTall);
    let bottomPipe = new Pipe(_x, 'BOTTOM', _bottomTall);

    this.children.push(topPipe);
    this.children.push(bottomPipe);
  }

  // update the state
  update() {
    super.update();

    this.x = this.children[0].x;
  }

  // display the results of state
  render() {
    super.render();
  }
}

class Bird extends GameObject {
  private birdSpriteSheet =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAgCAYAAADtwH1UAAAAAXNSR0IArs4c6QAAAf1JREFUaEPtWUtahDAMprLWpSdy4U08kzdx4Ylc6hrxo06ZJn0kBdrMlLjwc5jCT/5HUtAM5T9z4SmmcD21vCv8LeR0RQClduT7Q+vnCAAA5znEN+b/Mv537tgwDByMHA9d43PI6ZoARgKq1p8TwAIDx/+M4H7N02/gfH/BzhScAr+KAH5LuvzNSRo242YB7gnfJyY7XObvhyCtqQRUIQClb7mZHvBVgPQQgAmsZIBFgDDqkZtaXe0locCB1rCMgWfHjv0VSRw+vwf8KgLsHMS7BbgnfLYAriichAN3QqwHHJyMo/E5yQMC79wJqgBXNtnJqyOA67mPU7xVX4bQ6jjUo91xRp/HswAWLoTPuG+wJJVExnVA/dcEqAAM7ry4HGTAYBua6oGU86e3V1YB4/vHOk7QCdkWUBGf1Xpq4asAzG1vCwGcIaO7kenzGRh2fPmyn53zPWdTSaCeB1rjFyXA8XBU/TEyWhMQfQeED1Y0wG0KgAtO2Ro7Ibku3fujAjTEh6+bE0/grgVRRiitP5mAhgRICwBaL7W9bCFAdBZQgrgkZAYA1fuzraghPqsF45vdWj/5/wAH1JAAaQPcjACs4egtKnU4tVs6BX4JadTLspJrlZK/rO8SvzZpW4g+1TkqgLDcKoAKIMyAMLwmQAUQZkAYXhOgAggzIAz/B1cvAj8VnrhOAAAAAElFTkSuQmCC';

  // initial state
  private frameIndex: number = 0;
  constructor() {
    super(new WASDController());

    this.x = 50;
    this.y = 250;
    this.width = 32;
    this.height = 32;
  }

  // update the state
  update() {
    super.update();

    if (this.command == 'FLAP') {
      this.y -= FLAP_POWER;
      this.frameIndex = this.frameIndex >= 2 ? 0 : this.frameIndex + 1;
    } else {
      this.y += GRAVITY;
    }
  }

  // display the results of state
  render() {
    super.render();

    let flappyBird = new Image();
    flappyBird.src = this.birdSpriteSheet;
    let framesPerRow = 3;
    let numofRows = 1;
    let frameWidth = flappyBird.width / framesPerRow;
    let frameHeight = flappyBird.height / numofRows;

    ctx.drawImage(
      flappyBird,
      (this.frameIndex % framesPerRow) * frameWidth,
      Math.floor(this.frameIndex / framesPerRow) * frameHeight,
      frameWidth,
      frameHeight,
      this.x,
      this.y,
      frameWidth,
      frameHeight
    );

    let a = (this.frameIndex % framesPerRow) * frameWidth;
    let b = Math.floor(this.frameIndex / framesPerRow) * frameHeight;
  }
}

class Score extends GameObject {
  public score: number = 0;

  constructor() {
    super();
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.font = FONT_SCORE;
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText(String(this.score), 200, 50);
    ctx.strokeStyle = COLOR_OUTLINE_SCORE;
    ctx.strokeText(String(this.score), 200, 50);
  }

  increment() {
    this.score += 1;
  }
}

class NewGameButton extends GameObject {
  constructor(x, y) {
    super(new ClickController());

    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 30;
  }

  update() {
    super.update();

    if (this.command == 'CLICK') {
      game.stop();
      game.changeScene(new MainLevel());
      game.start();
    }
  }

  render() {
    super.render();

    ctx.fillStyle = COLOR_BUTTON;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    let buttonTitle = 'New Game';
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(buttonTitle, this.x + 10, this.y + 20);
  }
}

class TitleScreen extends GameObject {
  private module;
  constructor() {
    super();
    let moduleWindow =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAABXJJREFUeF7t1sFpkFEQRtEE+wl2oGVZgmVpB5J+guJGlKC+7y1zT3biPGHO/Bfz+OCHAIG/CjyyIUDg7wIC8XUQ+IeAQHweBATiGyBwJ+B/kDs3ryICAokc2pp3AgK5c/MqIiCQyKGteScgkDs3ryICAokc2pp3AgK5c/MqIiCQyKGteScgkDs3ryICAokc2pp3AgK5c/MqIiCQyKGteScgkDs3ryICAokc2pp3AgK5c/MqIvAqkA9P775HdrcmgVcCX59f/mhCID4SAr8JCMTnQOAfAlMgX759hkngzQt8fP/p144CefPntuAqIJBVzHxKQCCpc1t2FRDIKmY+JSCQ1LktuwoIZBUznxIQSOrcll0FBLKKmU8JCCR1bsuuAgJZxcynBASSOrdlVwGBrGLmUwICSZ3bsquAQFYx8ykBgaTObdlVQCCrmPmUgEBS57bsKiCQVcx8SkAgqXNbdhUQyCpmPiUgkNS5LbsKCGQVM58SEEjq3JZdBQSyiplPCQgkdW7LrgICWcXMpwQEkjq3ZVcBgaxi5lMCAkmd27KrgEBWMfMpAYGkzm3ZVUAgq5j5lIBAUue27CogkFXMfEpAIKlzW3YVEMgqZj4lIJDUuS27CghkFTOfEhBI6tyWXQUEsoqZTwkIJHVuy64CAlnFzKcEBJI6t2VXAYGsYuZTAgJJnduyq4BAVjHzKQGBpM5t2VVAIKuY+ZSAQFLntuwqIJBVzHxKQCCpc1t2FRDIKmY+JSCQ1LktuwoIZBUznxIQSOrcll0FBLKKmU8JCCR1bsuuAgJZxcynBASSOrdlVwGBrGLmUwICSZ3bsquAQFYx8ykBgaTObdlVQCCrmPmUgEBS57bsKiCQVcx8SkAgqXNbdhUQyCpmPiUgkNS5LbsKCGQVM58SEEjq3JZdBQSyiplPCQgkdW7LrgICWcXMpwQEkjq3ZVcBgaxi5lMCAkmd27KrgEBWMfMpAYGkzm3ZVUAgq5j5lIBAUue27CogkFXMfEpAIKlzW3YVEMgqZj4lIJDUuS27CghkFTOfEhBI6tyWXQUEsoqZTwkIJHVuy64CAlnFzKcEBJI6t2VXAYGsYuZTAgJJnduyq4BAVjHzKQGBpM5t2VVAIKuY+ZSAQFLntuwqIJBVzHxKQCCpc1t2FRDIKmY+JSCQ1LktuwoIZBUznxIQSOrcll0FBLKKmU8JCCR1bsuuAgJZxcynBASSOrdlVwGBrGLmUwICSZ3bsquAQFYx8ykBgaTObdlVQCCrmPmUgEBS57bsKiCQVcx8SkAgqXNbdhUQyCpmPiUgkNS5LbsKCGQVM58SEEjq3JZdBQSyiplPCQgkdW7LrgICWcXMpwQEkjq3ZVcBgaxi5lMCAkmd27KrgEBWMfMpAYGkzm3ZVUAgq5j5lIBAUue27CogkFXMfEpAIKlzW3YVEMgqZj4lIJDUuS27CghkFTOfEhBI6tyWXQUEsoqZTwkIJHVuy64CAlnFzKcEBJI6t2VXAYGsYuZTAgJJnduyq4BAVjHzKYHrQFJKliXw8PDw9fnl8XeIP/7w8y8+PL37TopAVUAg1cvb+0jgv4Ec/SuGCEQEXv2KFdnbmgSOBARyxGSoKiCQ6uXtfSQgkCMmQ1UBgVQvb+8jAYEcMRmqCgikenl7HwkI5IjJUFVAINXL2/tIQCBHTIaqAgKpXt7eRwICOWIyVBUQSPXy9j4SEMgRk6GqgECql7f3kYBAjpgMVQUEUr28vY8EBHLEZKgqIJDq5e19JCCQIyZDVQGBVC9v7yMBgRwxGaoKCKR6eXsfCQjkiMlQVUAg1cvb+0hAIEdMhqoCAqle3t5HAgI5YjJUFRBI9fL2PhIQyBGToarADyGkAgXqQnuZAAAAAElFTkSuQmCC';

    this.module = new Image();
    this.module.src = moduleWindow;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.drawImage(this.module, 100, 100);

    let title = 'Flappy Bird';
    ctx.font = FONT_SCORE;
    ctx.fillStyle = COLOR_TITLE;
    ctx.fillText(title, 120, 180);
    ctx.strokeStyle = COLOR_OUTLINE_TITLE;
    ctx.strokeText(title, 120, 180);
  }
}

class GameOverScreen extends GameObject {
  private module;
  private score: number;
  constructor(_score: number) {
    super();
    this.score = _score;
    let moduleWindow =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAABXJJREFUeF7t1sFpkFEQRtEE+wl2oGVZgmVpB5J+guJGlKC+7y1zT3biPGHO/Bfz+OCHAIG/CjyyIUDg7wIC8XUQ+IeAQHweBATiGyBwJ+B/kDs3ryICAokc2pp3AgK5c/MqIiCQyKGteScgkDs3ryICAokc2pp3AgK5c/MqIiCQyKGteScgkDs3ryICAokc2pp3AgK5c/MqIiCQyKGteScgkDs3ryICAokc2pp3AgK5c/MqIvAqkA9P775HdrcmgVcCX59f/mhCID4SAr8JCMTnQOAfAlMgX759hkngzQt8fP/p144CefPntuAqIJBVzHxKQCCpc1t2FRDIKmY+JSCQ1LktuwoIZBUznxIQSOrcll0FBLKKmU8JCCR1bsuuAgJZxcynBASSOrdlVwGBrGLmUwICSZ3bsquAQFYx8ykBgaTObdlVQCCrmPmUgEBS57bsKiCQVcx8SkAgqXNbdhUQyCpmPiUgkNS5LbsKCGQVM58SEEjq3JZdBQSyiplPCQgkdW7LrgICWcXMpwQEkjq3ZVcBgaxi5lMCAkmd27KrgEBWMfMpAYGkzm3ZVUAgq5j5lIBAUue27CogkFXMfEpAIKlzW3YVEMgqZj4lIJDUuS27CghkFTOfEhBI6tyWXQUEsoqZTwkIJHVuy64CAlnFzKcEBJI6t2VXAYGsYuZTAgJJnduyq4BAVjHzKQGBpM5t2VVAIKuY+ZSAQFLntuwqIJBVzHxKQCCpc1t2FRDIKmY+JSCQ1LktuwoIZBUznxIQSOrcll0FBLKKmU8JCCR1bsuuAgJZxcynBASSOrdlVwGBrGLmUwICSZ3bsquAQFYx8ykBgaTObdlVQCCrmPmUgEBS57bsKiCQVcx8SkAgqXNbdhUQyCpmPiUgkNS5LbsKCGQVM58SEEjq3JZdBQSyiplPCQgkdW7LrgICWcXMpwQEkjq3ZVcBgaxi5lMCAkmd27KrgEBWMfMpAYGkzm3ZVUAgq5j5lIBAUue27CogkFXMfEpAIKlzW3YVEMgqZj4lIJDUuS27CghkFTOfEhBI6tyWXQUEsoqZTwkIJHVuy64CAlnFzKcEBJI6t2VXAYGsYuZTAgJJnduyq4BAVjHzKQGBpM5t2VVAIKuY+ZSAQFLntuwqIJBVzHxKQCCpc1t2FRDIKmY+JSCQ1LktuwoIZBUznxIQSOrcll0FBLKKmU8JCCR1bsuuAgJZxcynBASSOrdlVwGBrGLmUwICSZ3bsquAQFYx8ykBgaTObdlVQCCrmPmUgEBS57bsKiCQVcx8SkAgqXNbdhUQyCpmPiUgkNS5LbsKCGQVM58SEEjq3JZdBQSyiplPCQgkdW7LrgICWcXMpwQEkjq3ZVcBgaxi5lMCAkmd27KrgEBWMfMpAYGkzm3ZVUAgq5j5lIBAUue27CogkFXMfEpAIKlzW3YVEMgqZj4lIJDUuS27CghkFTOfEhBI6tyWXQUEsoqZTwkIJHVuy64CAlnFzKcEBJI6t2VXAYGsYuZTAgJJnduyq4BAVjHzKYHrQFJKliXw8PDw9fnl8XeIP/7w8y8+PL37TopAVUAg1cvb+0jgv4Ec/SuGCEQEXv2KFdnbmgSOBARyxGSoKiCQ6uXtfSQgkCMmQ1UBgVQvb+8jAYEcMRmqCgikenl7HwkI5IjJUFVAINXL2/tIQCBHTIaqAgKpXt7eRwICOWIyVBUQSPXy9j4SEMgRk6GqgECql7f3kYBAjpgMVQUEUr28vY8EBHLEZKgqIJDq5e19JCCQIyZDVQGBVC9v7yMBgRwxGaoKCKR6eXsfCQjkiMlQVUAg1cvb+0hAIEdMhqoCAqle3t5HAgI5YjJUFRBI9fL2PhIQyBGToarADyGkAgXqQnuZAAAAAElFTkSuQmCC';

    this.module = new Image();
    this.module.src = moduleWindow;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.drawImage(this.module, 100, 100);

    let title = 'Game Over';
    ctx.font = FONT_SCORE;
    ctx.fillStyle = COLOR_TITLE;
    ctx.fillText(title, 120, 160);
    ctx.strokeStyle = COLOR_OUTLINE_TITLE;
    ctx.strokeText(title, 120, 160);

    ctx.font = FONT_SCORE;
    ctx.fillStyle = COLOR_GO_SCORE;
    ctx.fillText(String(this.score), 180, 200);
    ctx.strokeStyle = COLOR_OUTLINE_GO_SCORE;
    ctx.strokeText(String(this.score), 180, 200);
  }
}

/* ---------------------------- InputController  ---------------------------- */

class WASDController extends InputController {
  private command: string;

  constructor() {
    super();

    document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == ' ') {
          this.command = 'FLAP';
        }
      },
      false
    );
  }

  update(gameObject: GameObject) {
    gameObject.command = this.command;
    this.command = null;
  }
}

class ClickController extends InputController {
  private command: string;

  constructor() {
    super();

    document.addEventListener(
      'mousedown',
      (evt) => {
        this.command = 'CLICK';
      },
      false
    );
  }

  update(gameObject: GameObject) {
    gameObject.command = this.command;
    this.command = null;
  }
}

/* ----------------------------------- SCENE --------------------------------- */

class StartLevel extends Scene {
  constructor() {
    super();
  }

  create() {
    let titleScreen: TitleScreen = new TitleScreen();
    this.add(titleScreen);

    let newGameButton: NewGameButton = new NewGameButton(150, 220);
    this.add(newGameButton);
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }
}

class GameOverLevel extends Scene {
  private score: number;
  constructor(_score: number) {
    super();
    this.score = _score;
  }

  create() {
    let gameOverScreen: GameOverScreen = new GameOverScreen(this.score);
    this.add(gameOverScreen);

    let newGameButton: NewGameButton = new NewGameButton(150, 220);
    this.add(newGameButton);
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }
}

class MainLevel extends Scene {
  private MAX_TILES = 10;
  private bird: Bird;
  private score: Score;

  constructor() {
    super();
  }

  create() {
    let pairB = new PipePair(400, 3, this.MAX_TILES - GAP_DIFFICULTY - 3);
    this.add(pairB);

    let pairC = new PipePair(650, 4, this.MAX_TILES - GAP_DIFFICULTY - 4);
    this.add(pairC);

    this.bird = new Bird();
    this.add(this.bird);

    this.anims.createFromPiskel('bird', FlappyBird);
    this.anims.add('bird', this.bird);

    this.score = new Score();
    this.add(this.score);

    this.physics.onCollideWalls(this.bird, this.birdHitWall, this);

    this.physics.onCollide(this.bird, pairB, this.birdHitPipe, this);
    this.physics.onCollide(this.bird, pairC, this.birdHitPipe, this);
  }

  update() {
    super.update();

    this.removePipes();
    this.addPipes();
    this.scorePoint();
  }

  render() {
    super.render();
  }

  removePipes() {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].x < -70) {
        this.children.splice(i, 1);
      }
    }
  }

  addPipes() {
    if (this.children.length < 5) {
      let topLength = Util.getRandomInt(0, this.MAX_TILES - 1 - GAP_DIFFICULTY);
      let bottomLength = this.MAX_TILES - GAP_DIFFICULTY - topLength;

      let customPair = new PipePair(450, topLength, bottomLength);
      this.add(customPair);
      this.physics.onCollide(this.bird, customPair, this.birdHitPipe, this);
    }
  }

  scorePoint() {
    let points = 0;
    for (let i = 0; i < this.children.length; i++) {
      if (this.bird.x == this.children[i].x + this.children[i].width) {
        points++;
      }
    }
    if (points > 0) this.score.increment();
  }

  birdHitWall(bird) {
    if (bird.y > canvas.height) {
      game.stop();
      game.changeScene(new GameOverLevel(this.score.score));
      game.start();
    }
  }

  birdHitPipe() {
    game.stop();
    game.changeScene(new GameOverLevel(this.score.score));
    game.start();
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let startLevel = new StartLevel();
let game = new Game(startLevel);

// TODO
//
// - PICO PLANET HERE
//
