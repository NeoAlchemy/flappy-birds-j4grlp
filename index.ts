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

/* --------------------------------- ENTITIES ------------------------------- */
class Pipe extends GameObject {
  private TLPipeTile =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHBJREFUWEdj5PRi+M8wgIBx0DiguWdgggEeAgPuAGEv4kKgwIk4dTBVE/bhVw8PgQF3AK4oQPcBuSGArg9mLsE0MOqA0RAYDYHREBgNgdEQGA2B0RAYDYHREKBbCJDW2qee6oHvG+LyC706rYwD7QAAevW9N+4Q0b0AAAAASUVORK5CYII=';

  private TRPipeTile =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAJVJREFUWEdj5PRi+M8wgIBxwB3Qc21gQqC2BBLsjAPuAJkpAxMCb7dBQ2DYOKDACeKjCfsgNC4+LMPB0wC1QmDAHQDzGSGf0ywEBtwBAx4FA+6AAY+CAXfAgEfBgDtgwKNgwB0w4FEw4A4Y8CgYcAcMeBQMuAMGPAoG3AEDHgVkO2DAu2YjxgHftzEwYuuE0613jMsBAHoXpb2yPCBbAAAAAElFTkSuQmCC';

  private TRUpsideDownPipeTile =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAIpJREFUWEdj5PRi+M9AB/B9GwMjNmsYR4wDcAUy3UIApwNkplAnDRQ4QayYsA9C4+LDHFJbAmExDhsHwHxGyOc0C4EBd8BoGhjwKBhwB4ymgQGPggF3wGgaGPAoGHAHjKaBAY+CAXfAaBogtXP1dhuVW8VkO6DnGnX6BaQ6AN4vGHAH0KtzOmj7hgBmzKW9AISKgAAAAABJRU5ErkJggg==';

  private TLUpsideDownPipeTile =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHlJREFUWEdjZMABOL0Y/uOSo6Y444A7gF4+xeVRxkHjgOYe7G6csA9VvMCJtBQA04+uDyYOD4FRB4yGwGgIjIbAaAiMhsBoCIyGwGgIjIbAgIeAsBdxrV1yW8UE+wUD7gBcUUBcuJCvimC/gHyjidM5eLpmxLmX+qoAcXy9N/59tfoAAAAASUVORK5CYII=';

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
    this.height = _tall ? (_tall + 1) * TILE_HEIGHT : 2 * TILE_HEIGHT;
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
      let tlPipe = new Image();
      tlPipe.src = this.TLPipeTile;
      ctx.drawImage(tlPipe, this.x, this.y, TILE_WIDTH, TILE_HEIGHT);

      // TR
      let trPipe = new Image();
      trPipe.src = this.TRPipeTile;
      ctx.drawImage(
        trPipe,
        this.x + TILE_WIDTH,
        this.y,
        TILE_WIDTH,
        TILE_HEIGHT
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
      let tlPipe = new Image();
      tlPipe.src = this.TLUpsideDownPipeTile;
      ctx.drawImage(
        tlPipe,
        this.x,
        this.y + this.tall * TILE_HEIGHT,
        TILE_WIDTH,
        TILE_HEIGHT
      );

      // TR
      let trPipe = new Image();
      trPipe.src = this.TRUpsideDownPipeTile;
      ctx.drawImage(
        trPipe,
        this.x + TILE_WIDTH,
        this.y + this.tall * TILE_HEIGHT,
        TILE_WIDTH,
        TILE_HEIGHT
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
  // initial state
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
    } else {
      this.y += GRAVITY;
    }
  }

  // display the results of state
  render() {
    super.render();

    ctx.fillStyle = '#FF0';
    ctx.fillRect(this.x, this.y, this.width, this.height);
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

/* ----------------------------------- SCENE --------------------------------- */
class MainLevel extends Scene {
  private MAX_TILES = 10;
  private bird: Bird;

  constructor() {
    super();
  }

  create() {
    this.add(new PipePair(150, 2, this.MAX_TILES - GAP_DIFFICULTY - 2));
    this.add(new PipePair(400, 3, this.MAX_TILES - GAP_DIFFICULTY - 3));
    this.add(new PipePair(650, 4, this.MAX_TILES - GAP_DIFFICULTY - 4));

    this.bird = new Bird();
    this.add(this.bird);

    this.physics.onCollideWalls(this.bird, this.birdHitWall, this);
  }

  update() {
    super.update();

    this.removePipes();
    this.addPipes();
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
    if (this.children.length < 6) {
      let topLength = Util.getRandomInt(0, this.MAX_TILES - 1 - GAP_DIFFICULTY);
      let bottomLength = this.MAX_TILES - GAP_DIFFICULTY - topLength;
      this.add(new PipePair(650, topLength, bottomLength));
    }
  }

  birdHitWall(bird) {
    if (bird.y > canvas.height) {
      //
      // HOW TO START A NEW GAME
      //
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let mainLevel = new MainLevel();
let game = new Game(mainLevel);


// TODO
// - HOW TO START A NEW GAME
// - HOW TO STOP A GAME
// 
// - FLAPPY TO BE A ANIMATED