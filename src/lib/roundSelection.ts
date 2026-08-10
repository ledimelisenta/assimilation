export function shuffle<T>(items:readonly T[],random:()=>number=Math.random):T[]{
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
  return result;
}

export function selectRoundItems<T extends {id:string}>(pool:readonly T[],roundSize:number,previousIds:readonly string[]=[],random:()=>number=Math.random):T[]{
  const unique=[...new Map(pool.map(item=>[item.id,item])).values()];
  const size=Math.min(roundSize,unique.length);
  const previous=new Set(previousIds);
  const fresh=shuffle(unique.filter(item=>!previous.has(item.id)),random);
  const chosen=fresh.slice(0,size);
  if(chosen.length<size){
    const chosenIds=new Set(chosen.map(item=>item.id));
    const repeats=shuffle(unique.filter(item=>!chosenIds.has(item.id)),random);
    chosen.push(...repeats.slice(0,size-chosen.length));
  }
  if(chosen.length>1&&chosen.every((item,index)=>item.id===previousIds[index]))chosen.push(chosen.shift()!);
  return chosen;
}
