/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
export const canvas = <HTMLCanvasElement>document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();
const BACKGROUND: string =
  'https://static.vecteezy.com/system/resources/thumbnails/009/877/673/small_2x/pixel-art-sky-background-with-clouds-cloudy-blue-sky-for-8bit-game-on-white-background-vector.jpg'; //or could be #000
// const BACKGROUND: string = '#000';

// utility functions to use everywhere
export class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getTextureFromPiskel(sprite: any): any {
    let spriteLayer = JSON.parse(sprite.piskel.layers[0]);
    let aImg: HTMLImageElement = new Image();
    aImg.setAttribute('src', spriteLayer.chunks[0].base64PNG);
    return {
      image: aImg,
      width: sprite.piskel.width,
      height: sprite.piskel.height,
    };
  }
}

// Input Controller to use everywhere
export class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

export class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public command: string;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

export class Group {
  public x: number;
  public y: number;
  public children: Array<GameObject>;

  constructor() {
    this.children = [];
  }

  update() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.update();
    }
  }

  render() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.render();
    }
  }
}

export class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: Group,
    callback: Function,
    scope: any
  ): void;
  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ): void;
  onCollide(
    objectA: GameObject,
    objectB: GameObject | Group,
    callback: Function,
    scope: any
  ): void {
    if (objectA && objectB) {
      if ('children' in objectB) {
        for (let gameObject of objectB.children) {
          this.gameObjectCollisionRegister.push({
            objectA: objectA,
            objectB: gameObject,
            callback: callback,
            scope: scope,
          });
        }
      } else {
        this.gameObjectCollisionRegister.push({
          objectA: objectA,
          objectB: objectB,
          callback: callback,
          scope: scope,
        });
      }
    }
  }

  onCollideWalls(objectA: GameObject, callback: Function, scope: any) {
    if (objectA) {
      this.wallCollisionRegister.push({
        objectA: objectA,
        callback: callback,
        scope: scope,
      });
    }
  }

  update() {
    for (let collisionEntry of this.gameObjectCollisionRegister) {
      if (
        collisionEntry.objectA.x >= 0 &&
        collisionEntry.objectA.x <= canvas.width &&
        collisionEntry.objectA.y >= 0 &&
        collisionEntry.objectA.y <= canvas.height &&
        collisionEntry.objectB.x >= 0 &&
        collisionEntry.objectB.x <= canvas.width &&
        collisionEntry.objectB.y >= 0 &&
        collisionEntry.objectB.y <= canvas.height &&
        collisionEntry.objectA.x + collisionEntry.objectA.width >
          collisionEntry.objectB.x &&
        collisionEntry.objectA.x + collisionEntry.objectA.width <
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.y + collisionEntry.objectA.height >
          collisionEntry.objectB.y &&
        collisionEntry.objectA.y <
          collisionEntry.objectB.y + collisionEntry.objectB.height
      ) {
        collisionEntry.callback.apply(collisionEntry.scope, [
          collisionEntry.objectA,
          collisionEntry.objectB,
        ]);
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < 0 ||
        wallCollisionEntry.objectA.y + wallCollisionEntry.objectA.height >
          canvas.height ||
        wallCollisionEntry.objectA.x < 0 ||
        wallCollisionEntry.objectA.x + wallCollisionEntry.objectA.width >=
          canvas.width
      ) {
        wallCollisionEntry.callback.apply(wallCollisionEntry.scope, [
          wallCollisionEntry.objectA,
        ]);
      }
    }
  }
}

class AnimationManager {
  private manager: any = {};

  constructor() {}

  add(key: string, gameObject: GameObject) {
    if (!this.manager[key]) {
      this.manager[key] = {};
    }
    this.manager[key].gameObject = gameObject;
  }

  createFromPiskel(key: string, sprite: any) {
    if (!this.manager[key]) {
      this.manager[key] = {};
    }
    let spriteLayer = JSON.parse(sprite.piskel.layers[0]);
    this.manager[key].configuration = {
      img: new Image(),
      framesPerRow: spriteLayer.chunks[0].layout.length,
      numOfRows: spriteLayer.chunks[0].layout[0].length,
      frameWidth: sprite.piskel.width,
      frameHeight: sprite.piskel.height,
      fps: sprite.piskel.fps,
      lastTimestamp: new Date(),
      frameIndex: 0,
    };
    this.manager[key].configuration.img.src = spriteLayer.chunks[0].base64PNG;
    this.manager[key].configuration.timestep =
      1000 / this.manager[key].configuration.fps; // ms for each frame
  }

  play(key: string) {
    let timestamp = new Date();
    this.animate(key, timestamp);
  }

  animate(key: string, timestamp: Date) {
    if (
      this.manager[key] &&
      this.manager[key].gameObject &&
      this.manager[key].configuration
    ) {
      let config = this.manager[key].configuration;
      if (
        timestamp.valueOf() - config.lastTimestamp.valueOf() >
        config.timestep
      ) {
        config.frameIndex++;
        config.lastTimestamp = timestamp;
      }

      config.frameIndex =
        config.frameIndex > config.framesPerRow - 1 ? 0 : config.frameIndex;

      ctx.drawImage(
        config.img,
        (config.frameIndex % config.framesPerRow) * config.frameWidth,
        Math.floor(config.frameIndex / config.framesPerRow) *
          config.frameHeight,
        config.frameWidth,
        config.frameHeight,
        this.manager[key].gameObject.x,
        this.manager[key].gameObject.y,
        config.frameWidth,
        config.frameHeight
      );
    }
  }
}

export class Scene {
  public children: Array<GameObject>;
  public groups: Array<Group>;
  public physics: Physics;
  public anims: AnimationManager;

  constructor() {
    this.children = [];
    this.groups = [];
    this.physics = new Physics();
    this.anims = new AnimationManager();
  }

  add(object: Group): void;
  add(object: GameObject): void;
  add(object: GameObject | Group): void {
    if ('children' in object) {
      for (let gameObject of object.children) {
        this.children.push(gameObject);
      }
      this.groups.push(object);
    } else {
      this.children.push(object);
    }
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.update();
    }
    for (let group of this.groups) {
      if (group) group.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background

    if (BACKGROUND.startsWith('#')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.width;
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      let backgroundImage = new Image();
      backgroundImage.src = BACKGROUND;
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    for (let gameObject of this.children) {
      if (gameObject) gameObject.render();
    }
    for (let group of this.groups) {
      if (group) group.render();
    }
  }
}

export class Game {
  private scene: Scene;
  private id: number;
  private isRunning: boolean = true;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  gameLoop() {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    this.scene.update();
    this.scene.render();

    // call next frame
    cancelAnimationFrame(this.id);
    if (this.isRunning) {
      this.id = requestAnimationFrame(() => {
        this.gameLoop();
      });
    }
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.id);
  }

  start() {
    this.isRunning = true;
    this.id = requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  changeScene(scene: Scene) {
    this.scene = scene;
    this.scene.create();
  }
}
