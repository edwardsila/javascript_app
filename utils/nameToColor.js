function getColorFromFirstLetter(name) {
    const firstLetter = (name[0]).toLowerCase();
    // Define a color map with SMS app-like colors
    const colorMap = {
        a: "#2196F3", // Blue
        b: "#4CAF50", // Green
        c: "#FFC107", // Yellow
        d: "#FF5722", // Orange
        e: "#9C27B0", // Purple
        f: "#E91E63", // Pink
        g: "#795548", // Brown
        h: "#607D8B", // Gray
        i: "#3F51B5", // Indigo
        j: "#009688", // Teal
        k: "#FF9800", // Amber
        l: "#673AB7", // Deep Purple
        m: "#FF5252", // Red
        n: "#03A9F4", // Light Blue
        o: "#8BC34A", // Light Green
        p: "#FFEB3B", // Yellow
        q: "#FF9800", // Amber
        r: "#9E9E9E", // Grey
        s: "#607D8B", // Blue Grey
        t: "#2196F3", // Blue
        u: "#4CAF50", // Green
        v: "#FFC107", // Yellow
        w: "#FF5722", // Orange
        x: "#9C27B0", // Purple
        y: "#E91E63", // Pink
        z: "#795548", // Brown
    };

    // Return the color code for the first letter or a default color
    return colorMap[firstLetter] || "#1E3F6C"; // Default to black if not found
}


module.exports = getColorFromFirstLetter;