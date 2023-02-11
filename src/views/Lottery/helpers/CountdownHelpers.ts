import getTimePeriods from 'utils/getTimePeriods'
import moment from 'moment'

// const lotteryHours = Array.from(Array(24).keys())
const lotteryDrawHours = [14]
const lotterySaleHours = [15]
// const lotteryDrawHours = [0, 8, 16]
const lotteryDrawMinutes = [0]
const lotterySaleMinutes = [0]
// const lotteryDrawMinutes = [0]


// find closest time in an array
// for example arr [15,35,55], keyNumber is 10 then result is 15, if 57 then 0
const findNearestNumber = (arr, keyNumber) => {
  let nextNumber = arr.find(_ => keyNumber <= _);
  if (nextNumber === undefined)
    nextNumber  = arr[0]

  return nextNumber
}

const getClosestLotteryDrawTime = (currentMillis) => {
  const currentUtcTime = moment.utc(currentMillis)

  const currentUtcMinutes = currentUtcTime.minutes();
  const currentUtcHours = currentUtcTime.hours();
  let addedDays = 0;
  let addedHours = 0;

  const nextUtcMinutes = findNearestNumber(lotteryDrawMinutes, currentUtcMinutes);    
  if (currentUtcMinutes > lotteryDrawMinutes[lotteryDrawMinutes.length-1])  {
    addedHours += 1      
  }
  
  const nextUtcHours = findNearestNumber(lotteryDrawHours, currentUtcHours + addedHours);
  if (currentUtcHours + addedHours > lotteryDrawHours[lotteryDrawHours.length-1])  {
    addedDays += 1        
  }

  let nextDrawTime = currentUtcTime
  nextDrawTime = nextDrawTime.add(addedDays, 'day')
  nextDrawTime = nextDrawTime.hours(nextUtcHours)
  nextDrawTime = nextDrawTime.minutes(nextUtcMinutes)

  return nextDrawTime.valueOf();
}

const getClosestLotterySaleTime = (currentMillis) => {    
  const currentUtcTime = moment.utc(currentMillis)

  const currentUtcMinutes = currentUtcTime.minutes();
  const currentUtcHours = currentUtcTime.hours();
  let addedDays = 0;
  let addedHours = 0;

  const nextUtcMinutes = findNearestNumber(lotterySaleMinutes, currentUtcMinutes);    
  if (currentUtcMinutes > lotterySaleMinutes[lotterySaleMinutes.length-1])  {
    addedHours += 1      
  }
  
  const nextUtcHours = findNearestNumber(lotterySaleHours, currentUtcHours + addedHours);
  if (currentUtcHours + addedHours > lotterySaleHours[lotterySaleHours.length-1])  {
    addedDays += 1        
  }

  let nextSaleTime = currentUtcTime
  nextSaleTime = nextSaleTime.add(addedDays, 'day')
  nextSaleTime = nextSaleTime.hours(nextUtcHours)
  nextSaleTime = nextSaleTime.minutes(nextUtcMinutes)

  return nextSaleTime.valueOf();
}

const getNextLotteryDrawTime = (currentMillis) => {
  const closestLotteryDrawTime = getClosestLotteryDrawTime(currentMillis)
  return closestLotteryDrawTime;
}

const getNextLotterySaleTime = (currentMillis) => {
  const closestLotterySaleTime = getClosestLotterySaleTime(currentMillis)
  return closestLotterySaleTime;
}

// @ts-ignore
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`

export const getLotteryDrawTime = (currentMillis): string => {
  const nextLotteryDrawTime = getNextLotteryDrawTime(currentMillis)
  const msUntilLotteryDraw = nextLotteryDrawTime - currentMillis
  const { minutes } = getTimePeriods(msUntilLotteryDraw / 1000)
  const { hours } = getTimePeriods(msUntilLotteryDraw / 1000)
  return hoursAndMinutesString(hours, minutes)
}

export const getLotterySaleTime = (currentMillis): string => {
  const nextLotteryDrawTime = getNextLotterySaleTime(currentMillis)
  const msUntilLotteryDraw = nextLotteryDrawTime - currentMillis
  const { minutes } = getTimePeriods(msUntilLotteryDraw / 1000)
  const { hours } = getTimePeriods(msUntilLotteryDraw / 1000)
  return hoursAndMinutesString(hours, minutes)
}

export const getTicketSaleStep = () => (1 / 8) * 100

export const getLotteryDrawStep = (currentMillis) => {
  // const msBetweenLotteries = 43200000 // 12h * 60m * 60s * 1000ms
  const msBetweenLotteries = 86400000 // 24h * 60m * 60s * 1000ms

  const endTime = getNextLotteryDrawTime(currentMillis)
  const msUntilLotteryDraw = endTime - currentMillis
  const percentageRemaining = (msUntilLotteryDraw / msBetweenLotteries) * 100
  return 100 - percentageRemaining
}

