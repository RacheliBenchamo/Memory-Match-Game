# Memory Match Game

**Author:** Racheli Benchamo

Welcome to the Memory Match Game! This game is designed to test and improve your memory skills by matching pairs of cards. 

## How to Play

1. **Start Screen**:
   - Enter your username (max 12 characters, spaces at the beginning and end will be trimmed. Case insensitive, e.g., "Eli" is the same as "eli").
   - Click the "Start Game" button to begin.
   - View the leaderboard by clicking on the "Leaderboard" button. This will display the top 3 scores since the page was loaded.
   - Adjust game settings by clicking on the "Settings" button.

2. **Settings**:
   - Choose the number of rows for the card board (default is 4, range: 2-5).
   - Choose the number of columns for the card board (default is 4, range: 2-5).
   - Set the duration (in seconds) for which a pair of cards will be displayed (range: 0.5-2.0 seconds).

   **Note**: The total number of cards (rows x columns) must be even. Therefore, combinations like 3x3, 5x5, and 3x5 are not allowed.

3. **Gameplay**:
   - The game board will display cards face down. Click on a card to flip it over and reveal its image.
   - Match pairs of cards based on their images.
   - The game uses 10 unique images (of the same size) that are randomly selected for each game.
   - You can cancel the game and return to the start screen by clicking the "Cancel Game" button.

4. **End of Game**:
   - Once all pairs are matched, the game will display your score, your position on the leaderboard, and the top 3 scores.
   - If you didn't make it to the leaderboard, an informative message will be displayed.

## Scoring

The score is calculated based on the number of cards in the game and the number of moves made. The exact scoring function is proprietary and ensures a balanced gameplay experience.

## Technical Details

- **Security**: The game solution is not stored in a way that allows users to inspect the DOM and discover the flipped cards.
- **Algorithm**: The Fisher–Yates algorithm is used to ensure a random and refreshed card selection. This ensures that the cards are shuffled properly before each game.

## Techniques Used

- **Responsive Design**: The game is built to be fully responsive, adapting to various screen sizes and devices.
- **Bootstrap**: Utilized the Bootstrap library for styling and responsive design elements.
- **Modern JavaScript (ES6)**: Leveraged modern JavaScript features for cleaner and more efficient code.
- **Functional Programming**: Adopted a functional programming paradigm for better code readability and maintainability.
- **Modularity**: The codebase is modular, ensuring each piece of functionality is separated and organized.
- **Efficiency**: Ensured the game runs smoothly and efficiently, providing a seamless user experience.

---

Enjoy the game and train your memory!
