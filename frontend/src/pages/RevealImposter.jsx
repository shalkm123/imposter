// import { useState, useEffect } from 'react';
// import { Eye, EyeOff, Users, AlertCircle } from 'lucide-react';

// export default function ImposterGame() {
//   const [playerNames, setPlayerNames] = useState([]);
//   const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
//   const [wordRevealed, setWordRevealed] = useState(false);
//   const [allWordsRevealed, setAllWordsRevealed] = useState(false);
//   const [imposterIndex, setImposterIndex] = useState(null);
//   const [showResults, setShowResults] = useState(false);

// useEffect(() => {
//   // prepare mock data
//   const mockPlayers = ['Alice', 'Bob', 'Charlie', 'Diana'];
//   const randomImposter = Math.floor(Math.random() * mockPlayers.length);

//   // update ALL state at once
//   setPlayerNames(mockPlayers);
//   setImposterIndex(randomImposter);
// }, []);


//   const getWordForPlayer = (index) => {
//     return index === imposterIndex ? 'Apple' : 'Mango';
//   };

//   const handleShowWord = () => {
//     setWordRevealed(true);
//   };

//   const handleNextPlayer = () => {
//     setWordRevealed(false);
//     if (currentPlayerIndex < playerNames.length - 1) {
//       setCurrentPlayerIndex(currentPlayerIndex + 1);
//     } else {
//       setAllWordsRevealed(true);
//     }
//   };

//   const handleRevealImposter = () => {
//     setShowResults(true);
//   };

//   const handleRestart = () => {
//     setCurrentPlayerIndex(0);
//     setWordRevealed(false);
//     setAllWordsRevealed(false);
//     setShowResults(false);
//     const newImposter = Math.floor(Math.random() * playerNames.length);
//     setImposterIndex(newImposter);
//   };

//   // Loading screen
//   if (playerNames.length === 0 || imposterIndex === null) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-8">
//         <div className="text-center">
//           <AlertCircle className="text-purple-300 mx-auto mb-4" size={64} />
//           <h2 className="text-2xl font-bold text-white mb-2">Loading Game...</h2>
//           <p className="text-purple-200">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   // Results screen
//   if (showResults) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold text-white mb-4">Game Results</h1>
//           </div>

//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
//             <h2 className="text-3xl font-bold text-center text-white mb-8">The Imposter Was...</h2>

//             <div className="grid gap-4 mb-8">
//               {playerNames.map((name, index) => (
//                 <div
//                   key={index}
//                   className={`p-6 rounded-xl border-2 transition-all ${
//                     index === imposterIndex
//                       ? 'bg-red-500/30 border-red-400 shadow-lg shadow-red-500/50'
//                       : 'bg-green-500/20 border-green-400/50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-white text-xl font-bold">{name}</div>
//                       <div
//                         className={`text-lg font-semibold mt-1 ${
//                           index === imposterIndex ? 'text-red-200' : 'text-green-200'
//                         }`}
//                       >
//                         {index === imposterIndex ? '🍎 Apple (Imposter!)' : '🥭 Mango'}
//                       </div>
//                     </div>
//                     {index === imposterIndex && <div className="text-4xl">👿</div>}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="text-center">
//               <button
//                 onClick={handleRestart}
//                 className="px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl"
//               >
//                 Play Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // All words revealed screen
//   if (allWordsRevealed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 flex items-center justify-center">
//         <div className="max-w-2xl w-full">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold text-white mb-4">All Words Revealed!</h1>
//             <p className="text-purple-200 text-lg">Now discuss and find the imposter</p>
//           </div>

//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
//             <Users className="text-purple-300 mx-auto mb-6" size={64} />
//             <p className="text-white text-xl mb-8">
//               All {playerNames.length} players have seen their words.
//               <br />
//               Time to discuss and vote!
//             </p>

//             <button
//               onClick={handleRevealImposter}
//               className="px-12 py-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-red-500/50"
//             >
//               🔍 Reveal The Imposter
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main game screen
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-white mb-4">Imposter Game</h1>
//           <p className="text-purple-200 text-lg">
//             Player {currentPlayerIndex + 1} of {playerNames.length}
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="bg-white/20 rounded-full h-4 overflow-hidden">
//             <div
//               className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
//               style={{ width: `${((currentPlayerIndex + 1) / playerNames.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl">
//           <div className="text-center mb-8">
//             <div className="text-purple-300 text-lg font-medium mb-3">Current Player</div>
//             <h2 className="text-4xl font-bold text-white mb-2">
//               {playerNames[currentPlayerIndex]}
//             </h2>
//             <div className="text-purple-200 text-xl">Player #{currentPlayerIndex + 1}</div>
//           </div>

//           {!wordRevealed ? (
//             <div className="text-center py-8">
//               <EyeOff className="text-purple-300 mx-auto mb-6" size={64} />
//               <p className="text-white text-xl mb-8">
//                 {playerNames[currentPlayerIndex]}, are you ready to see your word?
//               </p>
//               <button
//                 onClick={handleShowWord}
//                 className="px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-green-500/50"
//               >
//                 <Eye className="inline-block mr-3" size={28} />
//                 Show My Word
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <div className="mb-8">
//                 <div className="text-purple-300 text-xl font-medium mb-4">Your Word Is:</div>
//                 <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-6xl font-bold py-8 px-12 rounded-2xl shadow-2xl inline-block">
//                   {getWordForPlayer(currentPlayerIndex) === 'Apple' ? '🍎' : '🥭'}{' '}
//                   {getWordForPlayer(currentPlayerIndex)}
//                 </div>
//               </div>

//               <div className="bg-red-500/20 border-2 border-red-400/50 rounded-xl p-6 mb-8">
//                 <p className="text-red-200 text-lg font-semibold">
//                   ⚠️ Remember your word and don't let others see it!
//                 </p>
//               </div>

//               <button
//                 onClick={handleNextPlayer}
//                 className="px-12 py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl"
//               >
//                 {currentPlayerIndex < playerNames.length - 1 ? 'Next Player →' : 'Finish →'}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Instructions */}
//         <div className="mt-8 bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
//           <h3 className="text-blue-200 font-bold text-lg mb-2">📋 How to Play:</h3>
//           <ul className="text-blue-100 space-y-2">
//             <li>• Each player will see their word one by one</li>
//             <li>• One player is the imposter with a different word</li>
//             <li>• After everyone sees their word, discuss and find the imposter</li>
//             <li>• Don't reveal your word directly!</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
