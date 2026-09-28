const fs=require('fs');
const p='index.html';
let s=fs.readFileSync(p,'utf8');
let changed=0;
function rep(a,b,label){if(!s.includes(a))throw new Error('Patch target not found: '+label);s=s.replace(a,b);changed++;}

// 1) Separate primary topic from secondary tags. Strong money language wins over incidental parenting mentions.
rep("function normalizeForMatch(text=''){", `function primaryTopic(text=''){
  const t=String(text).toLowerCase();
  const groups=currentLang==='en'?[
    ['money',/money|bill|bills|debt|loan|mortgage|rent|salary|income|spending|budget|saving|savings|credit card|financial|finance|cost of living/i],
    ['partner',/husband|wife|partner|spouse|boyfriend|girlfriend/i],
    ['work',/work|office|boss|career|job|return to work/i],
    ['parenting',/parenting|kid|child|baby|toddler|son|daughter|daycare|preschool|school|bedtime|tantrum/i],
    ['family',/mother|father|parents|in.?laws|family/i],
    ['housework',/dishes|laundry|clean|housework|chores|cooking/i]
  ]:[
    ['돈',/돈|생활비|카드값?|신용카드|대출|빚|부채|월세|전세|주거비|소비|지출|예산|저축|적금|월급|연봉|소득|재테크|투자|경제적|금전|물가|비용|돈이 부족|돈이 없|돈 때문에/],
    ['남편',/남편|배우자|신랑|아내/],
    ['직장',/회사|직장|상사|출근|퇴근|업무|커리어|이직|복직/],
    ['육아',/육아|아이|애|아기|딸|아들|등원|하원|유치원|어린이집|재우|훈육/],
    ['가족',/시댁|시어머니|시아버지|친정|친정엄마|친정아빠|부모님|가족/],
    ['집안일',/집안일|설거지|청소|빨래|가사/]
  ];
  for(const [topic,re] of groups){if(re.test(t))return topic}
  return '';
}
function orderedTags(text=''){
  const tags=inferTags(text);
  const primary=primaryTopic(text);
  return primary?[primary,...tags.filter(x=>x!==primary)]:tags;
}
function normalizeForMatch(text=''){`, 'primary topic helper');

// Saved posts should store primary topic first.
rep("      tags:inferTags(draft.body),", "      tags:orderedTags(draft.body),", 'save ordered tags');

// Title must use the same primary topic rather than whichever regex happens to run first.
const oldKo=`  if(/남편|배우자|신랑|아내/.test(text)) return '배우자 때문에 마음이 답답해요';\n  if(/아이|애|아기|딸|아들|육아|유치원|어린이집/.test(text)) return '육아 때문에 오늘 마음이 복잡했어요';\n  if(/시댁|시어머니|시아버지|친정|부모님/.test(text)) return '가족 때문에 마음이 무거워요';\n  if(/돈|생활비|카드값?|대출|빚|부채|월세|전세|주거비|소비|지출|예산|저축|월급|연봉|소득|재테크|투자|금전|물가|비용/.test(text)) return '돈 문제 때문에 마음이 무거워요';\n  if(/회사|복직|상사|직장|업무/.test(text)) return '회사 생각에 마음이 무거워요';`;
const newKo=`  const topic=primaryTopic(text);\n  if(topic==='돈') return '돈 문제 때문에 마음이 무거워요';\n  if(topic==='남편') return '배우자 때문에 마음이 답답해요';\n  if(topic==='직장') return '회사 생각에 마음이 무거워요';\n  if(topic==='육아') return '육아 때문에 오늘 마음이 복잡했어요';\n  if(topic==='가족') return '가족 때문에 마음이 무거워요';`;
rep(oldKo,newKo,'Korean title classification');

const oldEn=`    if(/husband|wife|partner|spouse|boyfriend|girlfriend/i.test(text)) return 'Something with my partner is weighing on me';\n    if(/kid|child|baby|toddler|daycare|preschool|school|parent/i.test(text)) return 'Parenting felt especially hard today';\n    if(/mother|father|parents|in.?laws|family/i.test(text)) return 'Family has been weighing on me';\n    if(/work|office|boss|career|job/i.test(text)) return 'Work feels like too much right now';`;
const newEn=`    const topic=primaryTopic(text);\n    if(topic==='money') return 'Money has been weighing on me';\n    if(topic==='partner') return 'Something with my partner is weighing on me';\n    if(topic==='work') return 'Work feels like too much right now';\n    if(topic==='parenting') return 'Parenting felt especially hard today';\n    if(topic==='family') return 'Family has been weighing on me';`;
rep(oldEn,newEn,'English title classification');

// 2) Swipe horizontally between My stories and Saved stories in Records.
rep("async function renderRecords(type){", `let recordsSwipeStartX=null;\nlet recordsSwipeStartY=null;\nfunction initRecordsSwipe(){\n  const records=document.getElementById('records');\n  if(!records||records.dataset.swipeReady==='1')return;\n  records.dataset.swipeReady='1';\n  records.addEventListener('touchstart',e=>{\n    if(e.touches.length!==1)return;\n    recordsSwipeStartX=e.touches[0].clientX;\n    recordsSwipeStartY=e.touches[0].clientY;\n  },{passive:true});\n  records.addEventListener('touchend',e=>{\n    if(recordsSwipeStartX===null||!e.changedTouches.length)return;\n    const dx=e.changedTouches[0].clientX-recordsSwipeStartX;\n    const dy=e.changedTouches[0].clientY-recordsSwipeStartY;\n    recordsSwipeStartX=recordsSwipeStartY=null;\n    if(Math.abs(dx)<55||Math.abs(dx)<=Math.abs(dy)*1.25)return;\n    // User requested: swipe right from My stories -> Saved stories. Reverse gesture returns.\n    if(dx>0&&currentRecordTab==='mine')renderRecords('saved');\n    else if(dx<0&&currentRecordTab==='saved')renderRecords('mine');\n  },{passive:true});\n}\ninitRecordsSwipe();\n\nasync function renderRecords(type){`, 'records swipe');

fs.writeFileSync(p,s);
console.log('Applied',changed,'classification/swipe patches');
