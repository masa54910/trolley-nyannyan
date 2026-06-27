const particles = Array.from({ length: 8 }, (_, index) => index);

export function GoalParticles() {
  return (
    <span className="goalParticles" aria-hidden="true">
      {particles.map((particle) => (
        <span className={`goalParticle goalParticle-${particle + 1}`} key={particle} />
      ))}
    </span>
  );
}
