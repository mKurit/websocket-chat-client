export default (text) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    var replacedText = text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });

    return replacedText;
}