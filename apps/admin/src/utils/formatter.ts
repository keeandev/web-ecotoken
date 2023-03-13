import { Country, State } from "country-state-city";

export const formatEnum = (enumValue: string) => {
    const split = enumValue.split("_");
    return split
        .map(
            (piece) =>
                piece.charAt(0).toUpperCase() +
                piece.substring(1).toLowerCase(),
        )
        .join(" ");
};

export const formatCountryAndState = (
    city: string,
    countryCode: string,
    stateCode: string,
) =>
    `${city}, ${
        State.getStateByCodeAndCountry(stateCode, countryCode)?.name
    }, ${Country.getCountryByCode(countryCode)?.name}`;
