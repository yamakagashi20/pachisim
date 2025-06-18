"use client";
import React from "react";

function MainComponent() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [gameActive, setGameActive] = useState(true);
  const [showEntry, setShowEntry] = useState(false); // エントリー演出の状態

  const launchBall = useCallback(() => {
    if (!gameActive) return;

    const newBall = {
      id: Date.now(),
      x: Math.random() * 40 + 30,
      y: 0,
      velocity: { x: 0, y: 0 },
    };

    setBalls((prev) => [...prev, newBall]);
  }, [gameActive]);

  useEffect(() => {
    let animationFrame;
    const updateGame = () => {
      setBalls((prevBalls) => {
        return prevBalls
          .map((ball) => {
            ball.velocity.y += 0.2;
            ball.y += ball.velocity.y;
            ball.x += ball.velocity.x;

            if (ball.y > 80) {
              if (ball.x > 30 && ball.x < 70) {
                setScore((prev) => prev + 100);
                // エントリー演出を表示
                setShowEntry(true);
                setTimeout(() => setShowEntry(false), 2000); // 2秒後に消す
              }
              return null;
            }

            const pins = [
              { x: 30, y: 30 },
              { x: 50, y: 30 },
              { x: 70, y: 30 },
              { x: 40, y: 45 },
              { x: 60, y: 45 },
              { x: 30, y: 60 },
              { x: 50, y: 60 },
              { x: 70, y: 60 },
            ];

            pins.forEach((pin) => {
              const dx = pin.x - ball.x;
              const dy = pin.y - ball.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 5) {
                ball.velocity.x = dx * -0.5;
                ball.velocity.y = Math.abs(ball.velocity.y) * -0.5;
              }
            });

            if (ball.x < 0 || ball.x > 100) {
              ball.velocity.x *= -0.5;
            }

            return ball;
          })
          .filter(Boolean);
      });
      animationFrame = requestAnimationFrame(updateGame);
    };

    animationFrame = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4">
      <style jsx global>{`
        @keyframes entryAnimation {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .entry-text {
          animation: entryAnimation 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-roboto mb-2">パチンコゲーム</h1>
          <div className="text-xl font-roboto">スコア: {score}</div>
        </div>

        <div className="relative bg-[#000000] border-2 border-[#333] rounded-lg h-[600px] overflow-hidden">
          {/* エントリー演出 */}
          {showEntry && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="entry-text text-4xl font-bold text-[#ffff00] bg-[#ff4444] px-6 py-3 rounded-lg shadow-lg">
                エントリー！
              </div>
            </div>
          )}

          {balls.map((ball) => (
            <div
              key={ball.id}
              className="absolute w-3 h-3 bg-[#ff4444] rounded-full"
              style={{
                left: `${ball.x}%`,
                top: `${ball.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {[
            { x: 30, y: 30 },
            { x: 50, y: 30 },
            { x: 70, y: 30 },
            { x: 40, y: 45 },
            { x: 60, y: 45 },
            { x: 30, y: 60 },
            { x: 50, y: 60 },
            { x: 70, y: 60 },
          ].map((pin, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-[#ffff00] rounded-full"
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          <div className="absolute bottom-0 left-[30%] w-[40%] h-[50px] bg-[#00ff00]" />
        </div>

        <div className="text-center mt-4">
          <button
            onClick={launchBall}
            className="bg-[#ff4444] hover:bg-[#cc3333] text-white font-bold py-2 px-4 rounded"
          >
            玉を打つ
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;