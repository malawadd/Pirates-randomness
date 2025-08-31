# Pirates - Pirate Dice Game

A pirate ship battle game where you roll dice using blockchain randomness. Fight enemy ships, collect cargo, and sail the seas!

## What is this?

This is a browser game where:
- You play as a pirate ship
- You roll dice to get cargo and attack enemies
- The dice rolls use **real blockchain randomness** (not fake computer random)
- You need a crypto wallet to play

## How to run the game

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get API keys** (both free)
   
   **Wallet Connect ID:**
   - Go to https://cloud.reown.com
   - Make an account
   - Create a new project
   - Copy the Project ID
   
   **Alchemy API Key:**
   - Go to https://www.alchemy.com
   - Make an account
   - Create a new app (choose Base Sepolia network)
   - Copy the API Key

3. **Create environment file**
   - Copy `.env.sample` to `.env`
   - Add your keys:
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key_here
   ```

4. **Start the game**
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000 in your browser
   - Connect your crypto wallet
   - Play the game!

## How to play

1. **Connect wallet** - Click the connect button
2. **Roll for cargo** - Get dice for your ship
3. **Fight enemies** - Roll dice to attack
4. **Reroll dice** - Try to get better numbers
5. **Collect loot** - Take treasure from defeated ships
6. **Sail to next level** - Face stronger enemies

## Game files

Important files you might want to change:

- `app/game/page.tsx` - Main game page
- `lib/game-core/scene.ts` - Game logic and rules
- `lib/game-core/ship.ts` - Ship behavior
- `lib/game-core/dice.ts` - Dice rolling
- `app/config.ts` - Blockchain settings

## Blockchain stuff

The game uses **Base Sepolia** testnet by default.

## Problems?

- Make sure your wallet has test coins
- Check that Wallet Connect ID is correct
- Try refreshing the browser
- Check browser console for errors

## What makes this special?

Normal games use fake randomness. This game uses **real blockchain randomness** that nobody can cheat or predict. Every dice roll is verified on the blockchain!
