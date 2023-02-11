export enum StepState {  
  ENTRY = 'Entry',
  LIVE = 'Live',
  END = 'End'
}

export interface ProgressStep {
  text: string  
  timeStamp?: number
  state?: StepState
}

