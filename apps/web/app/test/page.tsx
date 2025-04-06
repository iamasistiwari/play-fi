"use client"
import Ballpit from '@/components/ui/Ball';
import React, { useState } from 'react'


export default function Page() {
  const [count, setCount] = useState(1);
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-96 w-96 border">
        <Ballpit
          key={count}
          maxSize={0.1}
          colors={[0xff0000, 0x00ff00, 0x0000ff]}
          count={count}
          gravity={0.65}
          friction={0.99}
          wallBounce={1.4}
          followCursor={true}
          size0={0.4}
          maxVelocity={200}
          maxY={1}
          className="pb-0.5 opacity-15"
        />
      </div>
      <div className="border p-2">
        <button onClick={() => setCount((c) => c + 1)}>inc</button>
      </div>
    </div>
  );
}
