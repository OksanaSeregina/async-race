export function generateChunks<T>(value: Array<T>, perChunk: number): Array<Array<T>> {
  return value.reduce((resultArray: Array<Array<T>>, item: T, index: number) => {
    const chunkIndex = Math.floor(index / perChunk);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
}
