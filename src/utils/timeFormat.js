const convertEpochToDate = (epoch) => new Date(epoch * 1000).toString();

export default convertEpochToDate;
