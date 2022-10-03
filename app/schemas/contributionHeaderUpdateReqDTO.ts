import { ContributionHeaderResponse } from "./response-schema";

/**
 * This is Contribution header interface
 */
export interface ContributionHeaderDetails
    extends Omit<ContributionHeaderResponse, "createdBy" | "updatedBy"> { }

/**
 * This is Contribution Header update API Request DTO interface
 */
export interface ContributionHeaderRequestDTO {
    contributionHeader: Array<ContributionHeaderDetails>;
}
