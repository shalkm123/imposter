import { useState, useEffect} from 'react';
import { Users, Play, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'


export default function GameDashboard() {
  const [playerCount, setPlayerCount] = useState('');
  const [playerNames, setPlayerNames] = useState([]);
  const [currentName, setCurrentName] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login"); 
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
      }
    };

    verifyUser();
  }, []);

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    if (count >= 0 && count <= 8) {
      setPlayerCount(count === 0 ? '' : count);
      if (count < playerNames.length) {
        setPlayerNames(playerNames.slice(0, count));
      }
    }
  };

  const handleAddPlayer = () => {
    if (currentName.trim() !== '' && playerNames.length < playerCount) {
      setPlayerNames([...playerNames, currentName.trim()]);
      setCurrentName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const isGameReady = () => {
    return playerCount > 0 && playerNames.length === playerCount;
  };

 const handleStartGame = async () => {
  if (!isGameReady()) return;

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const gameId = uuidv4();

    const res = await fetch("http://localhost:5000/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        gameId,
        playerCount,
        playerNames
      })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("gameId", gameId);
      navigate("/reveal");
    } else {
      console.error("Error creating game:", data.message);
    }

  } catch (error) {
    console.error("Game creation error:", error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Game Dashboard
          </h1>
          <p className="text-purple-200 text-lg">Set up your game and get ready to play!</p>
        </div>

        {/* Setup Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-purple-300" size={28} />
            <h2 className="text-2xl font-semibold text-white">Player Setup</h2>
          </div>

          {/* Player Count Input */}
          <div className="mb-8">
            <label className="block text-purple-200 mb-3 text-lg font-medium">
              Number of Players (Max 8)
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={playerCount}
              onChange={handlePlayerCountChange}
              placeholder="Enter number of players"
              className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
            />
          </div>

          {/* Player Name Input */}
          {playerCount > 0 && playerNames.length < playerCount && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-200 mb-4">
                Add Player Names ({playerNames.length}/{playerCount})
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter player name"
                  className="flex-1 px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
                />
                <button
                  onClick={handleAddPlayer}
                  disabled={currentName.trim() === ''}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                    currentName.trim() !== ''
                      ? 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer transform hover:scale-105'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Players Display */}
        {playerNames.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Players in Game</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {playerNames.map((name, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl p-4 border border-purple-300/30 transform hover:scale-105 transition-transform"
                >
                  <div className="text-purple-200 text-sm font-medium mb-1">Player {index + 1}</div>
                  <div className="text-white text-lg font-bold truncate">{name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Game Button */}
        <div className="flex justify-center relative">
          <div
            onMouseEnter={() => !isGameReady() && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative"
          >
            <button
            onClick={handleStartGame}
            disabled={!isGameReady()}
            className={`
                px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all transform
                ${isGameReady() 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:scale-105 hover:shadow-green-500/50 cursor-pointer' 
                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-2 border-gray-500/50'
                }
            `}
            >
            {isGameReady() ? (
                <>
                <Play size={28} />
                <span>Start Game</span>
                </>
            ) : (
                <>
                <AlertCircle size={28} />
                <span>Start Game</span>
                </>
            )}
            </button>


            {/* Tooltip */}
            {showTooltip && !isGameReady() && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-6 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap border border-gray-700">
                Please enter the number and names of the players
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-8 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}