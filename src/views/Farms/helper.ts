export const getLockUpData = (currentBlock, startBlock, lockBlocks, unlockBlocks) => {
    const cycleDurations = lockBlocks + unlockBlocks;

    const howFarFromStartBlocks = currentBlock - startBlock;
    const howManyCycleDone = Math.floor(howFarFromStartBlocks / cycleDurations);
    const howManyBlocksDoneInCurrentCycle = howFarFromStartBlocks % cycleDurations;
    const isStakingTime = howManyBlocksDoneInCurrentCycle <= lockBlocks;
    const isHarvestTime = howManyBlocksDoneInCurrentCycle > lockBlocks;
    const remainingBlockToHarvest = lockBlocks - howManyBlocksDoneInCurrentCycle;
    const remainingBlockToNextCycle = cycleDurations - howManyBlocksDoneInCurrentCycle;
    const nextHarvestBlock = currentBlock + remainingBlockToHarvest;
    const nextCycleBlock = currentBlock + remainingBlockToNextCycle;

    return {
        cycleDurations, 
        howFarFromStartBlocks,
        howManyCycleDone,
        howManyBlocksDoneInCurrentCycle,
        isStakingTime,
        isHarvestTime,
        remainingBlockToHarvest,
        remainingBlockToNextCycle,
        nextHarvestBlock,
        nextCycleBlock
    }
}