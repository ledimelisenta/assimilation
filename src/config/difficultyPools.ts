export type PoolDifficulty='easy'|'normal'|'hard';
type PoolWord={id:string;written:string;reading:string;pattern:string;audio:string;note:string;context?:string};
type PoolGame={levels:Record<PoolDifficulty,PoolWord[]>;sentenceChallenges:{id:string;text:string;audio:string;targets:{written:string;reading:string;pattern:string}[]}[]};

export const difficultyPoolIds:Record<number,Record<PoolDifficulty,string[]>>={
  1:{
    easy:['g1_e_001','g1_e_002','g1_e_007','g1_e_008','g1_e_012','g1_n_002','g1_n_008'],
    normal:['g1_e_003','g1_e_005','g1_e_006','g1_e_010','g1_e_011','g1_e_013','g1_e_014','g1_n_001','g1_n_003','g1_n_004','g1_n_005','g1_n_006','g1_n_007','g1_n_009'],
    hard:['s01:0','s03:0','s05:0','s07:0','s07:1','s08:0','s08:1','s09:0','s10:0','g1_h_001','g1_h_002','g1_h_003']
  },
  2:{
    easy:['g2_e_001','g2_e_002','g2_e_006','g2_e_009','g2_e_012','g2_e_014','g2_e_015','g2_n_004','g2_n_007','g2_n_010','g2_n_013'],
    normal:['g2_e_003','g2_e_004','g2_e_005','g2_e_007','g2_e_010','g2_e_011','g2_e_013','g2_e_016','g2_n_001','g2_n_002','g2_n_005','g2_n_006','g2_n_008','g2_n_009','g2_n_011','g2_n_012'],
    hard:['s02:0','s04:0','s04:1','s04:2','s05:0','s06:0','s06:1','s09:0','g2_h_001']
  },
  3:{
    easy:['g3_e_001','g3_e_004','g3_e_005','g3_e_009','g3_e_011','g3_n_005','g3_n_009'],
    normal:['g3_e_002','g3_e_003','g3_e_008','g3_e_012','g3_n_001','g3_n_002','g3_n_003','g3_n_004','g3_n_006','g3_n_007','g3_n_008','g3_n_010','g3_n_011'],
    hard:['s01:0','s02:0','s10:0','s10:1','g3_h_001','g3_h_002','g3_h_003']
  }
};

export function getDifficultyPool(game:PoolGame,gameId:number,difficulty:PoolDifficulty){const ids=difficultyPoolIds[gameId]?.[difficulty]??[];const levelItems=Object.values(game.levels).flat();return ids.map(key=>{if(key.includes(':')){const [challengeId,indexText]=key.split(':');const challenge=game.sentenceChallenges.find(item=>item.id===challengeId);const target=challenge?.targets[Number(indexText)];if(!challenge||!target)throw new Error(`Не найдено задание ${gameId}/${key}`);return{id:`${challenge.id}-${indexText}`,written:target.written,reading:target.reading,pattern:target.pattern,audio:challenge.audio,note:'',context:challenge.text}}const item=levelItems.find(word=>word.id===key);if(!item)throw new Error(`Не найдено задание ${gameId}/${key}`);return item})}

export function findDifficultyDuplicates(pools:Record<PoolDifficulty,PoolWord[]>){const owners=new Map<string,Set<PoolDifficulty>>();for(const difficulty of ['easy','normal','hard'] as PoolDifficulty[])for(const item of pools[difficulty]){const key=item.written.trim().replace(/[.!?]/g,'');const levels=owners.get(key)??new Set<PoolDifficulty>();levels.add(difficulty);owners.set(key,levels)}return[...owners].filter(([,levels])=>levels.size>1).map(([original,levels])=>({original,difficulties:[...levels]}))}

export function validateDifficultyPools(game:PoolGame,gameId:number){const pools={easy:getDifficultyPool(game,gameId,'easy'),normal:getDifficultyPool(game,gameId,'normal'),hard:getDifficultyPool(game,gameId,'hard')};const duplicates=findDifficultyDuplicates(pools);const empty=(Object.keys(pools) as PoolDifficulty[]).filter(level=>pools[level].length===0);return{pools,duplicates,empty}}
