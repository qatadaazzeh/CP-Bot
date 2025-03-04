const timeConvert = (time) => {
    let dateString = ``;
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    dateString += `${hours}:${minutes}`
    return dateString;
}

export default timeConvert;
