(function() {
    
    function Compare(strA, strB) {
        for (var result = 0, i = strA.length; i--;) {
            if (typeof strB[i] == 'undefined' || strA[i] == strB[i]);
            else if (strA[i].toLowerCase() == strB[i].toLowerCase())
                result++;
            else
                result += 4;
        }
        return 1 - (result + 4 * Math.abs(strA.length - strB.length)) / (2 * (strA.length + strB.length));
    }

    GLOBAL["similar"] = Compare;
})();

module.exports = {
    similar: similar,
}
