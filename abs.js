function isRelative(url) {
    var relpath = /^\.{1,2}\/([^\\\/\:\*\?\"\<\>\|]+\/)*[^\<\>\/\\\|\:\"\*\?]+\.[a-z0-9]+$/i;
    return relpath.test(url)
}
