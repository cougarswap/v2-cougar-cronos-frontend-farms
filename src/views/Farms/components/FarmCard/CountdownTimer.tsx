import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'


const TimerContent = styled.div<{fontSize?: string}>`
  font-size: ${({fontSize}) => fontSize ?? '1em'};
  color: ${({ theme }) => theme.colors.secondary};
`

export interface CountdownTimerProps {
  seconds: number
  fontSize?: string
}

const CountdownTimer : React.FC<CountdownTimerProps> = ({ seconds, fontSize = '' }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);    
  
    useEffect(() => {
      // exit early when we reach 0
      if (!timeLeft) return undefined;
  
      // save intervalId to clear the interval when the
      // component re-renders
      const intervalId = setInterval(() => {
        const newTimeLeft = timeLeft - 1        
        setTimeLeft(newTimeLeft);        

      }, 1000);
  
      // clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
      // add timeLeft as a dependency to re-rerun the effect
      // when we update it
    }, [timeLeft]);
  
    const newDay = (Math.floor((timeLeft) / (3600 * 24))).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });

    const remainingHoursInMiliseconds = Math.floor((timeLeft) % (3600 * 24));

    const newHour = (Math.floor((remainingHoursInMiliseconds) / 3600)).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    const newMinute = (Math.floor((remainingHoursInMiliseconds % 3600) / 60)).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    const newSecond = (Math.floor((remainingHoursInMiliseconds % 3600) % 60)).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    return (
      <TimerContent fontSize={fontSize}>
        <h5>{`${newDay}d ${newHour}h ${newMinute}m ${newSecond}s`}</h5>
      </TimerContent>
    );
  };

  export default CountdownTimer;