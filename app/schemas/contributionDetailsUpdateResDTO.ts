
export interface ContributionDetailsUpdateError{
    errorCode: string,
    errorDetail: string
}

export interface ContributionDetailsResponseDTO
{
    message?:string,
    errors?:Array<ContributionDetailsUpdateError>,
    type: string,
    instance: string
}
