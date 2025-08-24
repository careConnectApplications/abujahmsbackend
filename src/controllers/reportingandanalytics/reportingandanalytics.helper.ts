// helper to merge counts by gender
export function mergeCounts(arr1:any, arr2:any) {
  const map = new Map();
  [...arr1, ...arr2].forEach(({ _id, count }) => {
    map.set(_id, (map.get(_id) || 0) + count);
  });
  return Array.from(map, ([gender, count]) => ({ _id: gender, count }));
}