const fetcher = async (arg: string) => {
  const response = await fetch(arg);
  const data = await response.json();
  return data;
};

const ArgFetcher = (arg: string) =>{
  return fetcher(arg);
}
export default ArgFetcher;