export const Style = {
    textN0: 30,
    textN1: 18,
    textN2: 16,
    textN3: 14,
    textN4: 12,
    borderRadius: 5,

    white: "#FFFFFF",
    MontserratRegular: "Montserrat Regular",
    MontserratMedium: "Montserrat Medium",
    MontserratBold: "Montserrat Bold",
    black: "#000",
    red: "#F44336",
    opaqueBackground: "#f8fafd",
    blueGray50: "#ECEFF1",
    greenGoCaution: "#ECEFF1",
    blueGray100: "#cfd8dc",
    blueGray200: "#B0BEC5",
    blueGray300: "#90A4AE",
    blueGray400: "#78909C",
    blueGray500: "#607D8B",
    blueGray600: "#546E7A",
    blueGray700: "#455A64",
    blueGray800: "#37474F",
    fernColor: "#8ebf43",
    greenInfo: "#4CAF50", //Cette couleur avec plus de luminosité
    blueA: "#00BCD4",
    blueColor: "#2962FF",
    acidGreen: "#AEEA00",
    greenColor: "#FFF5C2",
    orangeColor: "#FFAB00",
    primary: "#8ebf43",
    secondary: "#066938",
    baseColor:
        document && document?.getElementById("app_base_color") == null
            ? "#339b9a"
            : document?.getElementById("app_base_color")?.value,
    bgColor: "linear-gradient(to bottom, #248d9a , #5cbd99 )",
    purple: "#7D05B9",
    warningColor: "#FF9800",
    textColor: "#777"
}
