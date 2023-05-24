# Flappy Bird Clone

This is a clone of the popular game Flappy Bird built using StackBlitz.

## Game Mechanics

The game features the following mechanics:

- The player controls a bird and must navigate it through gaps between pipes.
- The bird falls due to gravity and can be propelled upwards by flapping its wings.
- The pipes appear at regular intervals, with varying heights to increase difficulty.
- The player earns points for successfully passing through the gaps between pipes.

## Game Specific Code

The game-specific code includes the following key components:

- `Pipe`: Represents a single pipe in the game. It has properties such as position, size, and image tiles.
- `PipePair`: Represents a pair of pipes (top and bottom) forming a gap for the bird to pass through.
- `Bird`: Represents the player-controlled bird character. It has properties for position, size, and sprite animation.
- `Score`: Keeps track of the player's score and displays it on the screen.
- `NewGameButton`: Allows the player to start a new game when clicked.

## Technologies Used

The game is built using the following technologies:

- JavaScript
- HTML5 Canvas
- Pico-Planet game engine (imported modules: canvas, ctx, GameObject, Group, InputController, Util, Scene, Game)

## Getting Started

To run the game locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Open the project in your preferred code editor.
3. Launch the game by opening the `index.html` file in a web browser.

## Credits

This game is developed by [Your Name]. Special thanks to the creators of the original Flappy Bird game for the inspiration.

## License

This project is licensed under the [MIT License](LICENSE).
