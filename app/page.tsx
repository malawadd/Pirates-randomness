'use client';
// import Image from 'next/image';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/walletConnect';
import { SeaBackground } from '@/components/SeaBackground';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handlePlayGame = () => {
    if (isConnected) {
      router.push('/game');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Sea and Sky Background */}
      <SeaBackground className="z-0" />
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Pirate-themed floating elements */}
      <div className="absolute inset-0 opacity-20 z-20">
        <div className="absolute top-20 left-10 text-6xl">⚓</div>
        <div className="absolute top-40 right-20 text-4xl">🏴‍☠️</div>
        <div className="absolute bottom-40 left-20 text-5xl">💰</div>
        <div className="absolute bottom-20 right-10 text-3xl">🎲</div>
        <div className="absolute top-60 left-1/3 text-4xl">⚔️</div>
        <div className="absolute bottom-60 right-1/3 text-5xl">🚢</div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative z-30">
        <div className="container mx-auto px-4 md:px-16 text-center">
          {/* Game Logo/Title */}
          <div className="mb-8">
            <h1 className="font-funnel-display text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider">
              Pirates
            </h1>
            <div className="text-4xl md:text-6xl mb-6">🏴‍☠️ ⚔️ 🎲</div>
            <p className="font-funnel-display text-xl md:text-2xl text-yellow-400 font-semibold">
              Pirate Dice Battle with Verifiable Randomness
            </p>
          </div>

          {/* Game Description */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="font-funnel-sans text-lg md:text-xl text-gray-300 mb-6">
              Ahoy matey! Navigate the treacherous seas in this dice-based battle game. 
              Roll your cargo, battle enemy ships, and use verifiable on-chain randomness 
              to ensure every roll is fair and transparent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-3xl mb-2">🎲</div>
                <h3 className="font-funnel-display text-lg font-bold text-white mb-2">Dice Combat</h3>
                <p className="font-funnel-sans text-sm text-gray-400">Roll dice to determine damage and cargo</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-3xl mb-2">⛓️</div>
                <h3 className="font-funnel-display text-lg font-bold text-white mb-2">On-Chain RNG</h3>
                <p className="font-funnel-sans text-sm text-gray-400">Verifiable randomness powered by Randamu</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-funnel-display text-lg font-bold text-white mb-2">Strategic Battles</h3>
                <p className="font-funnel-sans text-sm text-gray-400">Hire crew, upgrade ships, defeat the fleet</p>
              </div>
            </div>
          </div>

          {/* Wallet Connection and Play Button */}
          <div className="space-y-6">
            {!isConnected ? (
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-700 max-w-md mx-auto">
                <h3 className="font-funnel-display text-2xl font-bold text-white mb-4">
                  Set Sail, Captain!
                </h3>
                <p className="font-funnel-sans text-gray-300 mb-6">
                  Connect your wallet to enable verifiable on-chain dice rolls and start your pirate adventure.
                </p>
                <WalletConnect />
              </div>
            ) : (
              <div className="bg-green-900/80 p-8 rounded-lg border border-green-700 max-w-md mx-auto">
                <div className="text-4xl mb-4">⚓</div>
                <h3 className="font-funnel-display text-2xl font-bold text-white mb-4">
                  Ready for Battle!
                </h3>
                <p className="font-funnel-sans text-green-300 mb-6">
                  Wallet connected! You can now use verifiable on-chain randomness for your dice rolls.
                </p>
                <button
                  onClick={handlePlayGame}
                  className="w-full py-4 px-8 bg-yellow-600 hover:bg-yellow-500 text-black font-funnel-display font-bold text-lg rounded-lg transition-colors transform hover:scale-105"
                >
                  🏴‍☠️ START ADVENTURE 🏴‍☠️
                </button>
              </div>
            )}
          </div>

          {/* How to Play Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="font-funnel-display text-3xl md:text-4xl font-bold text-white mb-8">
              How to Play
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎲</div>
                <h4 className="font-funnel-display text-lg font-bold text-yellow-400 mb-2">1. Roll for Cargo</h4>
                <p className="font-funnel-sans text-sm text-gray-400">Start by rolling dice to determine your ship&apos;s cargo</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚔️</div>
                <h4 className="font-funnel-display text-lg font-bold text-yellow-400 mb-2">2. Battle Ships</h4>
                <p className="font-funnel-sans text-sm text-gray-400">Encounter enemy vessels and engage in dice combat</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">👥</div>
                <h4 className="font-funnel-display text-lg font-bold text-yellow-400 mb-2">3. Hire Crew</h4>
                <p className="font-funnel-sans text-sm text-gray-400">Recruit quartermasters, cannoneers, and navigators</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="font-funnel-display text-lg font-bold text-yellow-400 mb-2">4. Defeat the Fleet</h4>
                <p className="font-funnel-sans text-sm text-gray-400">Overcome the entire 13th fleet to claim victory</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}
