/**
 * 
 * @returns array of loop joinpoints that where
 * marked by a '#pragma clava data' node and
 * contain a json atribute 'uve' set to true
 */
Analyser.findUVECandidates = function () {
  return Query
    .search("loop", {
      data: data => data.uve,
    }).get();
}

/**
 * Note: Not used until better target analysis exists
 * @param {*} jp 
 * @param {*} streamNames 
 * @returns 
 */
Analyser.findStreamCompatibleArrayAccess = function (jp, streamNames) {
  return Query
    .searchFrom(jp, "arrayAccess", {
      arrayVar: array => streamNames.includes(array.name),
    })
    .get();
}

/**
 * At the time, the stream data is being given by the json file.
 * This allow to continue code generation while memory access
 * patterns are still being learn
 * TODO: Improve this to not only use json, but also automatical
 * analysis of access patterns 
 * @param loopJP 
 * @returns 
 */
Analyser.extractStreamsInfo = function (loopJP) {
  return loopJP?.data?.streams;
}