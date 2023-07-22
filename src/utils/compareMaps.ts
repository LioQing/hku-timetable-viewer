const compareMaps = (maybeMap1: Map<string, string[]> | null, maybeMap2: Map<string, string[]> | null) => {
  if (maybeMap1 === null && maybeMap2 === null) return true;
  if (maybeMap1 === null || maybeMap2 === null) return false;

  const map1 = maybeMap1!;
  const map2 = maybeMap2!;

  const compareArrays = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) return false;

    for (var i = 0, l = arr1.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) { 
        return false;   
      }
    }
    return true;
  };

  var testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (var [key, val] of map1) {
    testVal = map2.get(key);
    if ((testVal === undefined && !map2.has(key)) || !compareArrays(testVal!, val)) {
      return false;
    }
  }
  return true;
};

export default compareMaps;