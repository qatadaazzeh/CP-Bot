const timeConvert = (time) => {
    let dateString = ``;
    let hours = String(Math.floor(time / 3600)).padStart(2, '0');
    let seconds = String(time % 3600).padStart(2, '0');
    dateString += `${hours}:${seconds}`
    return dateString;
}

export default timeConvert;
