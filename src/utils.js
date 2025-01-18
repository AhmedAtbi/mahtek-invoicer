import { getAllISOCodes } from "iso-country-currency";


export const getFormattedURL = (url, params) => {
    var reg = new RegExp(Object.keys(params).join("|"), "gi");
    url = url.replace(reg, function (matched) {
        return params[matched];
    });

    return url;
};

export const ISO_COUNTRIES = getAllISOCodes();



//get the currency flag
export const setFlag = (value, exact = false) => {
    if (exact) {
        return "/flags/" + value.iso.toLowerCase() + ".svg";
    }
    return "/flags/" + value.iso.toLowerCase() + ".svg";
}



