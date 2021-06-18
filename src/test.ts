import { assert } from 'console'
import {getShows, aggregateData, highestAverageRunTime} from './tvMaze'


async function testGetShows(){


    let filteredShows = await getShows()
    let showNames = filteredShows.map((show) => show.name)


    assert(filteredShows.length === 3, "There are not three shows after filtering")
    assert(showNames.includes("The Leftovers"), "The Leftovers is not in the filtered list")
    assert(showNames.includes("True Detective"), "True Detective is not in the list.")
    assert(showNames.includes("Looking"), "Looking is not in the list.")

    console.log("Passed all assertions for the getShows function!")
}


async function testAggregateData(){
    let episodeData = await aggregateData()
    let leftovers = episodeData.find((ele) => ele.showName === "The Leftovers")
    let TrueDetective = episodeData.find((ele) => ele.showName === "True Detective")
    let Looking = episodeData.find((ele) => ele.showName === "Looking")

    assert(leftovers, "The Leftovers is not in the array")
    assert(TrueDetective, "True Detective is not in the array")
    assert(Looking, "Looking is not in your array")

    //console.log(TrueDetective)

    // Check the episodes and runtime match for Looking
    assert(Looking?.seasonData[1].episodes == 8, "Season 1 of Looking doesn't have 8 episodes.")
    assert(Looking?.seasonData[1].runtime == 240, "Season 1 of Looking doesn't have a runtime of 240 minutes.")
    assert(Looking?.seasonData[2].episodes == 10, "Season 2 of Looking doesn't have 10 episodes.")
    assert(Looking?.seasonData[2].runtime == 300, "Season 2 of Looking doesn't have a runtime of 300 minutes.")

    // Check the episodes and runtime match for True Detective
    assert(TrueDetective?.seasonData[1].episodes == 8, "Season 1 of True Detective doesn't have 8 episodes.")
    assert(TrueDetective?.seasonData[1].runtime == 480, "Season 1 of True Detective doesn't have a runtime of 480 minutes.")
    assert(TrueDetective?.seasonData[2].episodes == 8, "Season 2 of True Detective doesn't have 8 episodes.")
    assert(TrueDetective?.seasonData[2].runtime == 510, "Season 2 of True Detective doesn't have a runtime of 510 minutes.")
    assert(TrueDetective?.seasonData[3].episodes == 8, "Season 3 of True Detective doesn't have 8 episodes.")
    assert(TrueDetective?.seasonData[3].runtime == 503, "Season 3 of True Detective doesn't have a runtime of 503 minutes.")

    // Check the episodes and runtime match for The Leftovers
    assert(leftovers?.seasonData[1].episodes == 10, "Season 1 of leftovers doesn't have 10 episodes.")
    assert(leftovers?.seasonData[1].runtime == 600, "Season 1 of leftovers doesn't have a runtime of 600 minutes.")
    assert(leftovers?.seasonData[2].episodes == 10, "Season 2 of leftovers doesn't have 10 episodes.")
    assert(leftovers?.seasonData[2].runtime == 600, "Season 2 of leftovers doesn't have a runtime of 600 minutes.")
    assert(leftovers?.seasonData[3].episodes == 8, "Season 3 of leftovers doesn't have 8 episodes.")
    assert(leftovers?.seasonData[3].runtime == 495, "Season 3 of leftovers doesn't have a runtime of 495 minutes.")

    console.log("Passed all assertions for the aggregate function!")

}


async function testHighestAverage(){
    let highestAverageShow = await highestAverageRunTime()

    assert(highestAverageShow.show === "True Detective", "The average highest is not True Detective!")
    assert(highestAverageShow.max == 62.208333333333336, "The average runtime is different")

    console.log("Passed all assertions for the highest average function!")
}


testGetShows()
testAggregateData()
testHighestAverage()
