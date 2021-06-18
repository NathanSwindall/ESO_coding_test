import axios, { AxiosResponse } from 'axios';



interface Filter {
    genres: string[];
    network: {name: string, id: number};
    premiered: string;
    name: string;
    id: number;

}


type UrlName = {showName: string; url: string}

type SeasonData = {
    [key: number]: {runtime: number; episodes: number}
}


type Episode = [{
    season: number;
    number: number;
    runtime: number;
    name: string
}]





/*
This function will return shows with the following critera
- aired on HBO
- one of its genres is "Drama"
- the show premiered AFTER the year 2012 and BEFOre 2016
*/
export const getShows = async () => {
    // show endpoint
    const url = "https://api.tvmaze.com/shows"

    //premiere date range objects
    let year2012 = new Date('2013') //assuming after 2012 not inclusive
    let year2016 = new Date('2016')

    let response = await axios.get(url)
    let filters = response.data as Filter[]
    let filtered = filters.filter((tvShow) => {
        let hasDrama = tvShow.genres.includes('Drama')
        let onHBO = tvShow.network !== null ? tvShow.network.name === "HBO": false
        let rightPremiereDate = new Date(tvShow.premiered) > year2012 && new Date(tvShow.premiered) < year2016
        return hasDrama && onHBO && rightPremiereDate
    })

    return filtered
}

/*
This function will get the filtered shows and then find how many episoded are in this show per season 
and the total runtime for each season

*/
export const aggregateData = async () => {

    // get the filtered shows
    const filteredShows = await getShows()
    const url = (showID: number, showName: string) => ({showName, url: `https://api.tvmaze.com/shows/${showID}/episodes`})

    // create the urls to be requested
    const fitleredShowsUrls = filteredShows.map((show) => url(show.id,show.name))

    // Make all the get requests asynchronously
    const showEpisodes = await Promise.all(fitleredShowsUrls.map((urlObj) => getEpisodes(urlObj)))

    // aggregate the data from the requests
    const aggregatedData = showEpisodes.map((show) => ({seasonData: createAggregateDataObj(show.episodeData), showName: show.showName}))

    return aggregatedData



}


// get the highest average runtime
export const highestAverageRunTime = async () => {
    
    // get the aggregate data
    let showsData = await aggregateData()
    let averageEpisodeTime = showsData.map((show) => ({[show.showName]: (getTotal(show.seasonData, 'runtime') /getTotal(show.seasonData,'episodes'))}))
    return getMax(averageEpisodeTime)



}



/*****************************************************************************************************************************
 * Helper functions
 ******************************************************************************************************************************/


// gets the episodes for a specific show
const getEpisodes = async (urlObj: UrlName) => {
    const episodeResponses: AxiosResponse<Episode> = await axios.get(urlObj.url)
    const responseData = episodeResponses.data
    return {showName: urlObj.showName, episodeData: responseData }
    
}


// finds out how many episodes there are and how long the runtime is
const createAggregateDataObj = (responseData: Episode) => {
    let seasonData: SeasonData = {};
    for(let episode of responseData){
        if(episode.season in seasonData){
            seasonData[episode.season].episodes +=1
            seasonData[episode.season].runtime += episode.runtime
        }else{
            seasonData[episode.season] = {episodes: 1, runtime: episode.runtime}
        }
    }

    return seasonData
}


// Get the total amount of episodes or total amount of runtime. 
// kind of a bad design using the strings as keys

const getTotal = (showData: SeasonData, key: string) => {
    let seasons = Object.keys(showData)
    let total = 0
    for(let season of seasons){
        if(key === "episodes"){
            showData[1][key]
            total += showData[parseInt(season)].episodes
        }else if(key === "runtime"){

            total += showData[parseInt(season)].runtime
        }
    }

    return total
}


// find the max average runtime for a list of shows


const getMax = (averageRuns: {[key: string]: number}[]) => {
    let firstShow = averageRuns[0]
    let max = Object.values(firstShow)[0]
    let show = Object.keys(firstShow)[0]


    for(let currshow of averageRuns){
        let newMax = Object.values(currshow)[0]
        let newShow = Object.keys(currshow)[0]
        if(max < newMax){
            show = newShow
            max = newMax
        }
    }

    return {show, max}
}






