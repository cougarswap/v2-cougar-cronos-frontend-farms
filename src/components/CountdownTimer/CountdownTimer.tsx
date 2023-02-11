import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const fadein = keyframes`
  from { opacity: 0;  transform: translateY(-10px); }
  to   { opacity: 1;  transform: translateY(0); }
`

const TimerContent = styled.div`
  font-size: 2em;
  color: ${({ theme }) => theme.colors.ultraFocus};
  text-align: center;
  /* transition: all 2s ease; */
  animation: ${fadein} 1s ease;
`

const StyledUl = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledLi = styled.li`
  flex: 1 0 25%;
  display: inline-block;
  font-size: 0.7em;
  list-style-type: none;
  text-transform: uppercase; 
  padding: 5px;     
`

const StyledNumber = styled.span`
  display: block;
  font-size: 0.9em;
  border: 2px solid #ffbc77db;
  background-color: #30440c9f;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  margin: 0 auto;
  width: 50px;
  height: 50px;
  line-height: 50px;  
  box-sizing: content-box;
`

const StyledLabel = styled.label`
  display: block;
  font-size: 0.5em;
  color: #ffffff;
  font-weight: bold;
  margin-top: 5px;  
  margin-bottom: 0;  
  text-transform: uppercase;    
`

const CountdownTimer = ({ seconds }) => {
      
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);    

    useEffect(() => {
      if (seconds && seconds > 0) {
        setTimeLeft(seconds)
      }
    }, [seconds, setTimeLeft])

    useEffect(() => {
      // exit early when we reach 0
      if (!timeLeft) return undefined;
  
      // save intervalId to clear the interval when the
      // component re-renders
      const intervalId = setInterval(() => {
        const newTimeLeft = timeLeft > 0  ? timeLeft - 1 : 0
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

    const newHour = (Math.floor(remainingHoursInMiliseconds / 3600)).toLocaleString('en-US', {
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
      <TimerContent>
          <StyledUl>
            <StyledLi><StyledNumber>{newDay}</StyledNumber><StyledLabel>Days</StyledLabel></StyledLi>
            <StyledLi><StyledNumber>{newHour}</StyledNumber><StyledLabel>Hours</StyledLabel></StyledLi>
            <StyledLi><StyledNumber>{newMinute}</StyledNumber><StyledLabel>Minutes</StyledLabel></StyledLi>
            <StyledLi><StyledNumber>{newSecond}</StyledNumber><StyledLabel>Seconds</StyledLabel></StyledLi>
          </StyledUl>
      </TimerContent>
    );
  };

  export default CountdownTimer;