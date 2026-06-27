type SpaceDecorProps = {
  variant: "home" | "game";
};

const shootingStars = ["one", "two", "three"];
const distantPlanets = ["one", "two", "three"];
const asteroids = ["one", "two", "three", "four"];

export function SpaceDecor({ variant }: SpaceDecorProps) {
  return (
    <div className={`spaceDecor spaceDecor-${variant}`} aria-hidden="true">
      <span className="starLayer starLayerFine" />
      <span className="starLayer starLayerBright" />
      <span className="starLayer starLayerWarm" />
      {shootingStars.map((star) => (
        <span className={`shootingStar shootingStar-${star}`} key={star} />
      ))}
      {distantPlanets.map((planet) => (
        <span className={`distantPlanet distantPlanet-${planet}`} key={planet} />
      ))}
      {asteroids.map((asteroid) => (
        <span className={`asteroid asteroid-${asteroid}`} key={asteroid} />
      ))}
    </div>
  );
}
