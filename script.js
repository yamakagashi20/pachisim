function MainComponent() {
    const [score, setScore] = React.useState(0);
    const [balls, setBalls] = React.useState([]);
    const [gameActive, setGameActive] = React.useState(true);
    const [showEntry, setShowEntry] = React.useState(false);

    const launchBall = React.useCallback(() => {
        if (!gameActive) return;
        const newBall = {
            id: Date.now(),
            x: Math.random() * 40 + 30,
            y: 0,
            velocity: { x: 0, y: 0 },
        };
        setBalls(prev => [...prev, newBall]);
    }, [gameActive]);

    React.useEffect(() => {
        let animationFrame;
        const updateGame = () => {
            setBalls(prevBalls => {
                return prevBalls
                    .map(ball => {
                        ball.velocity.y += 0.2;
                        ball.y += ball.velocity.y;
                        ball.x += ball.velocity.x;

                        if (ball.y > 80) {
                            if (ball.x > 30 && ball.x < 70) {
                                setScore(prev => prev + 100);
                                setShowEntry(true);
                                setTimeout(() => setShowEntry(false), 2000);
                            }
                            return null;
                        }

                        const pins = [
                            { x: 30, y: 30 }, { x: 50, y: 30 }, { x: 70, y: 30 },
                            { x: 40, y: 45 }, { x: 60, y: 45 },
                            { x: 30, y: 60 }, { x: 50, y: 60 }, { x: 70, y: 60 }
                        ];

                        pins.forEach(pin => {
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
        <div className="game-container">
            <div className="game-wrapper">
                <h1 style={{textAlign: 'center'}}>パチンコゲーム</h1>
                <div className="score">スコア: {score}</div>
                <div className="game-board">
                    {showEntry && (
                        <div className="entry-text">エントリー！</div>
                    )}
                    {balls.map(ball => (
                        <div
                            key={ball.id}
                            className="ball"
                            style={{
                                left: `${ball.x}%`,
                                top: `${ball.y}%`
                            }}
                        />
                    ))}
                    {[
                        { x: 30, y: 30 }, { x: 50, y: 30 }, { x: 70, y: 30 },
                        { x: 40, y: 45 }, { x: 60, y: 45 },
                        { x: 30, y: 60 }, { x: 50, y: 60 }, { x: 70, y: 60 }
                    ].map((pin, index) => (
                        <div
                            key={index}
                            className="pin"
                            style={{
                                left: `${pin.x}%`,
                                top: `${pin.y}%`
                            }}
                        />
                    ))}
                    <div className="goal" />
                </div>
                <button className="launch-button" onClick={launchBall}>
                    玉を打つ
                </button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainComponent />);