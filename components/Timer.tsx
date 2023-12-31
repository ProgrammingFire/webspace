"use client";

import { cn, isEnded } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

interface TimerProps {
  endDate: Date;
}

function Timer({ endDate }: TimerProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [ended, setEnded] = useState(isEnded(endDate)[1]);
  // const [time, setTime] = useState<number>(0);

  const getTime = () => {
    const [time, ended] = isEnded(endDate);

    setEnded(ended);
    // setTime(time);

    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/solve"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-indigo-500 bg-secondary-bg flex h-full items-center justify-center text-base font-bold px-8 rounded-xl shadow-lg space-x-3"
      )}
    >
      {ended ? (
        <>
          <span className="bg-gradient-to-t primary-foreground">
            Challenge Time Ended!
          </span>
        </>
      ) : (
        <>
          <span className="bg-gradient-to-t primary-foreground">{hours}</span>
          <span>:</span>
          <span className="bg-gradient-to-b primary-foreground">{minutes}</span>
          <span>:</span>
          <span className="bg-gradient-to-t primary-foreground">{seconds}</span>
        </>
      )}
    </Link>
  );
}

export default Timer;
