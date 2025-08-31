/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/app/config';
import { ethers } from 'ethers';
import { Randomness } from 'randomness-js';
import { WIDTH, HEIGHT } from '../../lib/game-core/constants';
import { AudioManager } from '../../lib/game-core/engine/audio';
import { Game } from '../../lib/game-core/engine/game';
import { Mouse } from '../../lib/game-core/engine/mouse';
import { Scene } from '../../lib/game-core/scene';

interface GameCanvasProps {
    isConnected: boolean;
}

export default function GameCanvas({ isConnected }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);
    const mouseRef = useRef<Mouse>({ x: 0, y: 0 });
    const animationIdRef = useRef<number | undefined>(undefined);
    const sceneRef = useRef<Scene | null>(null);
    const isInitialized = useRef(false);

    // Use a ref to track the current connection status
    const isConnectedRef = useRef(isConnected);
    
    // Update the ref whenever isConnected changes
    useEffect(() => {
        isConnectedRef.current = isConnected;
    }, [isConnected]);

    // Web3 hooks for random number generation
    const { data: readData, refetch: refetchReadData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'randomness',
    }) as { data: bigint | undefined, refetch: () => void };

    const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
    const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess, error: transactionError } = useWaitForTransactionReceipt({
        hash,
    });

    // State for Web3 loading messages
    const [web3LoadingMessage, setWeb3LoadingMessage] = React.useState<string>('');

    // Stabilize the triggerWeb3Roll function with useCallback
    const triggerWeb3Roll = useCallback(async () => {
        // Use the ref to get the current connection status
        const currentIsConnected = isConnectedRef.current;
        console.log("🎲 triggerWeb3Roll called, isConnected:", currentIsConnected);
        
        if (!currentIsConnected) {
            console.log("❌ Wallet not connected");
            setWeb3LoadingMessage('Please connect your wallet first');
            setTimeout(() => setWeb3LoadingMessage(''), 3000);
            return;
        }

        console.log("✅ Wallet connected, generating random number...");
        setWeb3LoadingMessage('Preparing transaction...');

        try {
            const callbackGasLimit = 700_000;
            console.log("🔧 Creating provider and randomness instance...");
            const jsonProvider = new ethers.JsonRpcProvider(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`);

            const randomness = Randomness.createBaseSepolia(jsonProvider);
            console.log("💰 Calculating request price...");
            const [requestCallBackPrice] = await randomness.calculateRequestPriceNative(BigInt(callbackGasLimit));
            
            console.log("💸 Request price:", requestCallBackPrice.toString());
            setWeb3LoadingMessage('Confirm transaction in wallet...');
            
            console.log("📝 Calling writeContract...");
            // @ts-ignore
            const result = writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'generateWithDirectFunding',
                args: [callbackGasLimit],
                value: requestCallBackPrice,
            });
            
            console.log("🚀 writeContract result:", result);
        } catch (error) {
            console.error('❌ Web3 roll failed:', error);
            setWeb3LoadingMessage('Error: ' + (error as Error).message);
            setTimeout(() => setWeb3LoadingMessage(''), 5000);
        }
    }, [writeContract]); // Remove isConnected from dependencies since we use the ref

    // Handle transaction status changes
    useEffect(() => {
        if (isWritePending) {
            setWeb3LoadingMessage('Confirm transaction in wallet...');
        } else if (isTransactionLoading) {
            setWeb3LoadingMessage('Rolling dice on-chain...');
        } else if (isTransactionSuccess) {
            setWeb3LoadingMessage('Retrieving random number...');
            // Wait a bit then refetch the data
            setTimeout(async () => {
                await refetchReadData();
            }, 3000);
        } else if (writeError || transactionError) {
            setWeb3LoadingMessage('');
            console.error('Transaction error:', writeError || transactionError);
        }
    }, [isWritePending, isTransactionLoading, isTransactionSuccess, writeError, transactionError, refetchReadData]);

    // Handle received random data
    useEffect(() => {
        if (readData && isTransactionSuccess) {
            setWeb3LoadingMessage('');
            
            // Pass the result to the game scene
            if (sceneRef.current) {
                sceneRef.current.receiveWeb3RollResult(readData);
            }
        }
    }, [readData, isTransactionSuccess]);

    // Initialize game only once
    useEffect(() => {
        if (isInitialized.current) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        console.log('Initializing game...');
        isInitialized.current = true;

        // Initialize game
        const audio = new AudioManager(false);
        audio.prepare();
        audio.play();
        
        const game = new Game(audio, canvas);
        // Start with current connection status
        const scene = new Scene(game, triggerWeb3Roll, setWeb3LoadingMessage, isConnected);
        game.scene = scene;
        sceneRef.current = scene;
        gameRef.current = game;

        // Set up canvas
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        // Resize handling
        let ratio = 1;
        let x = 0;
        let y = 0;

        const resize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Calculate scale to fit the entire window
            const scaleX = windowWidth / WIDTH;
            const scaleY = windowHeight / HEIGHT;
            ratio = Math.min(scaleX, scaleY);
            
            // Center the canvas
            const scaledWidth = WIDTH * ratio;
            const scaledHeight = HEIGHT * ratio;
            x = (windowWidth - scaledWidth) / 2;
            y = (windowHeight - scaledHeight) / 2;
            
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.transformOrigin = 'top left';
            canvas.style.transform = `translate(${x}px, ${y}px) scale(${ratio})`;
            canvas.style.zIndex = '10';
        };

        resize();
        window.addEventListener('resize', resize);

        // Mouse handling
        let isFull = false;
        document.addEventListener('fullscreenchange', () => isFull = !isFull);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = (e.clientX - rect.left) / ratio;
            mouseRef.current.y = (e.clientY - rect.top) / ratio;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            audio.play();
            game.pressed(e);
        };

        const handleMouseDown = () => {
            audio.play();
            mouseRef.current.pressing = true;
            game.click(mouseRef.current);
        };

        const handleMouseUp = () => {
            mouseRef.current.pressing = false;
        };

        // Add event listeners
        canvas.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Game loop
        const tick = (t: number) => {
            animationIdRef.current = requestAnimationFrame(tick);
            ctx.resetTransform();
            game.update(t, mouseRef.current);
            game.draw(ctx);
            mouseRef.current.pressing = false;
        };

        animationIdRef.current = requestAnimationFrame(tick);

        // Cleanup
        return () => {
            console.log('Cleaning up game...');
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [triggerWeb3Roll]); // Add triggerWeb3Roll as dependency but it's stable due to useCallback

    // Update scene when connection status changes (without reinitializing the game)
    useEffect(() => {
        if (sceneRef.current && isInitialized.current) {
            console.log('🔄 Updating connection status in Scene:', isConnected);
            sceneRef.current.handleConnectionStatusChange(isConnected);
        }
    }, [isConnected]);

    return (
        <div className="fixed inset-0 bg-black">
            <canvas
                ref={canvasRef}
                style={{ imageRendering: 'pixelated' }}
            />
            {(web3LoadingMessage || !isConnected) && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        {!isConnected ? (
                            <>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect Your Wallet</h3>
                                <p className="text-gray-600 mb-4">Please connect your wallet to play with verifiable on-chain dice rolls</p>
                                <div className="text-sm text-gray-500">
                                    The game is running in the background. Connect your wallet to enable Web3 features.
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Web3 Dice Roll</h3>
                                <p className="text-gray-600">{web3LoadingMessage}</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}