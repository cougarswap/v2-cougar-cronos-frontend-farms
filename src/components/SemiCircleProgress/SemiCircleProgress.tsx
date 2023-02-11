import React from "react"
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";

export interface SemiCircleProgressProps {
    text?: string
    percent?: number
}


const SemiCircleProgress : React.FC<SemiCircleProgressProps> = ({
    text, percent
}) => {
    return (
        <AnimatedProgressProvider
            valueStart={0}
            valueEnd={percent}
            duration={1.4}
            easingFunction={easeQuadInOut}
            repeat
        >
          {value => {
              return (
                <CircularProgressbar 
                    value={value} 
                    text={`${value.toFixed(2)} % ${text}`}                                                        
                    styles={buildStyles({ 
                        pathTransition: "none",
                        // Text size
                        textSize: '10px',
                        textColor: '#22398c'
                    })}
                />
              )
          }}          
      </AnimatedProgressProvider>        
    )
}

export default SemiCircleProgress