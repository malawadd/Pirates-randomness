'use client';
import React, { useState } from 'react';
import GameCanvas from './GameCanvas';
import { useAccount } from 'wagmi';
import Wallet from '../wallet';

export default function Game() {
    const { isConnected } = useAccount();
    const [playWithoutWallet, setPlayWithoutWallet] = useState(false);

    return (
        <div className="relative">
            {/* GameCanvas is always mounted to preserve game state */}
            <GameCanvas isConnected={isConnected} />
            
            {/* Wallet overlay only shows when not connected and user hasn't chosen to play without wallet */}
            {!isConnected && !playWithoutWallet && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-30">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-4">
                        <h2 className="text-2xl font-bold text-center mb-4">Connect Your Wallet</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Connect your wallet to enable Web3 dice rolling with verifiable randomness
                        </p>
                        <Wallet />
                        <div className="mt-4 text-sm text-gray-500 text-center">
                            You can play without connecting, but rolls will use local randomness
                        </div>
                        <button
                            onClick={() => setPlayWithoutWallet(true)}
                            className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Play Without Wallet (Local Randomness)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}