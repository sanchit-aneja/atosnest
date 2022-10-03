
export interface ContributionHeaderUpdateError {
    errorCode: string,
    errorDetail: string
}

export interface ContributionHeaderResponseDTO {
    message?: string,
    errors?: Array<ContributionHeaderUpdateError>,
    type: string,
    instance: string
}
