function getParseableDate(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getUTCFullYear() +
        " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
