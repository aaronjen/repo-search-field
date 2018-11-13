// eslint-disable-next-line
export const parseLinkHeader = (s) => {
  const parts = s.split(',');
  const link = {};
  parts.forEach(p => {
    const rel = p.match(/rel="(\w+)"/)[1];
    const url = p.match(/<(.+)>/)[1];

    link[rel] = url;
  })
  
  return link;
}