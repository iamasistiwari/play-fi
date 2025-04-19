import React, { memo } from 'react'
import Ballpit from './ui/Ball';

function BallPit({ ballsCount }: { ballsCount: number }) {
  return (
    <Ballpit
      key={ballsCount}
      maxSize={0.1}
      colors={[0xff0000, 0x00ff00, 0x0000ff]}
      count={ballsCount}
      gravity={0.65}
      friction={0.99}
      wallBounce={1.4}
      followCursor={true}
      size0={0.4}
      maxVelocity={200}
      maxY={1}
      className="pb-0.5 opacity-15 z-10"
    />
  );
}

export default memo(
  BallPit, (prev, next) => prev.ballsCount === next.ballsCount);

