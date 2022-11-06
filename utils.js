function calculateReadingTime(wordCount) {
    const mins = wordCount/200
    const secs = Math.floor(mins) * 60
    return secs 
}

module.exports = {calculateReadingTime}
