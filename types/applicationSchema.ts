import { count } from "console";
import * as z from "zod";

const provinceNames = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon",
] as const;

const validInterests = [
    "Health", "Education", "Entertainment", "Arts+Culture", "Housing", "Other"
];

const applicationSchemaIndividual = z.object({
    full_name: z.string().refine(val => {
        return val.matchAll(/\b[A-Z][a-z]*\b/g).toArray().length >= 2;
    }, { message: "Full name must contain at least two words, each starting with a capital letter" }),

    email: z.email("Invalid email address"),

    phone_number: z.e164("Invalid phone number"),

    phone_type: z.enum(["Home", "Cell"], "Phone type must be either 'Home' or 'Cell'"),

    mailing_address: z.string().refine(val => {
        return val.trim().split(" ").length >= 3;
    }, { message: "Mailing address must include street number, street's name and optionally, unit number if one lives in an apartment" }),

    city: z.string(), // temporary, will add more detailed validation later

    province: z.enum(provinceNames, "Invalid province name"),

    country: z.string(),

    postal_code: z.string().regex(/^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$/, "Invalid Canadian postal code"),

    membership_interests: z.array(z.string()).refine(arr => {
        return arr.every(item => validInterests.includes(item));
    }, { message: "Invalid membership interests: Must match one or more of " + validInterests.join(", ") }),

    reason: z.string().refine(val => {
        const wordCount = val.trim().split(" ").length;
        return wordCount >= 100 && wordCount <= 200;
    }, { message: "Reason must be between 100 and 200 words" }),

    membership_free_waiver: z.boolean(),

    membership_free_waiver_reason: z.string().optional()

});

const applicationSchemaOrganization = z.object({
    full_name: z.string(),

    email: z.email("Invalid email address"),

    phone_number: z.e164("Invalid phone number"),

    phone_type: z.enum(["Home", "Cell"], "Phone type must be either 'Home' or 'Cell'"),

    mailing_address: z.string().refine(val => {
        return val.trim().split(" ").length >= 3;
    }, { message: "Mailing address must include street number, street's name and optionally, unit number if one lives in an apartment" }),

    city: z.string(), // temporary, will add more detailed validation later

    province: z.enum(provinceNames, "Invalid province name"),

    country: z.string(),

    postal_code: z.string().regex(/^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$/, "Invalid Canadian postal code"),

    membership_interests: z.array(z.string()).refine(arr => {
        return arr.every(item => validInterests.includes(item));
    }, { message: "Invalid membership interests: Must match one or more of " + validInterests.join(", ") }),

    reason: z.string().refine(val => {
        const wordCount = val.trim().split(" ").length;
        return wordCount >= 100 && wordCount <= 200;
    }, { message: "Reason must be between 100 and 200 words" }),

    programs_or_services: z.array(z.string()).refine(arr => arr.length > 0, { message: "At least one program or service must be provided" })
});

export { applicationSchemaIndividual, applicationSchemaOrganization };
export type IndividualApplication = z.infer<typeof applicationSchemaIndividual>;
export type OrganizationApplication = z.infer<typeof applicationSchemaOrganization>;
