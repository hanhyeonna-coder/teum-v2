const fs=require('fs');
const p='index.html';
let s=fs.readFileSync(p,'utf8');
let changed=0;

function replaceRegex(re,replacement,label){
  if(!re.test(s)) throw new Error('Patch target not found: '+label);
  s=s.replace(re,replacement); changed++;
}

replaceRegex(/function inferTags\(text\)\{[\s\S]*?\n\}\nfunction normalizeForMatch/, `function inferTags(text){
  const rules=currentLang==='en'?[
    ['partner',/husband|wife|partner|spouse|boyfriend|girlfriend/i],
    ['parenting',/parent|kid|child|baby|toddler|son|daughter|daycare|preschool|school|bedtime|tantrum/i],
    ['daycare',/daycare|preschool|day care|school drop.?off|pick.?up/i],
    ['school',/school|teacher|classroom|homework|school run/i],
    ['sleep',/sleep|bedtime|wake|woke|night/i],
    ['family',/mother|father|parents|in.?laws|family/i],
    ['work',/work|office|boss|career|job|return to work/i],
    ['money',/money|bill|bills|debt|loan|mortgage|rent|salary|income|spending|budget|saving|savings|credit card|financial|finance|cost of living/i],
    ['housework',/dishes|laundry|clean|housework|chores|cooking/i],
    ['overwhelmed',/overwhelmed|too much|can.?t handle/i],
    ['exhausted',/tired|exhausted|burnt out|burned out|worn out/i],
    ['hurt',/hurt|resent|upset|unappreciated/i],
    ['annoyed',/annoyed|irritated/i],['angry',/angry|mad|furious|pissed/i],['lonely',/lonely|alone/i]
  ]:[
    ['남편',/남편|배우자|신랑|아내/],
    ['육아',/육아|아이|애|아기|딸|아들|등원|하원|유치원|어린이집|재우|훈육/],
    ['등원',/등원/],['하원',/하원/],['유치원',/유치원/],['어린이집',/어린이집/],
    ['수면',/잠|수면|재우|밤잠|새벽/],
    ['가족',/가족/],['시댁',/시댁|시어머니|시아버지/],['친정',/친정|친정엄마|친정아빠|부모님/],
    ['직장',/회사|직장|상사|출근|퇴근|업무|커리어|이직/],['복직',/복직/],
    ['돈',/돈|생활비|카드값?|신용카드|대출|빚|부채|월세|전세|주거비|소비|지출|예산|저축|적금|월급|연봉|소득|재테크|투자|경제적|금전|물가|비용|돈이 부족|돈이 없|돈 때문에/],
    ['집안일',/집안일|설거지|청소|빨래|밥|가사/],
    ['육아분담',/육아.*분담|분담|독박|혼자.*육아|나만.*육아|도와주지/],
    ['성격차이',/성격|안 맞|대화가 안/],['폭력',/때렸|폭력|밀쳤|협박/],['19',/섹스|성관계|잠자리|부부관계/],
    ['지침',/지쳤|힘들|번아웃|피곤|쉬고 싶|버겁/],['서운함',/서운|섭섭/],['화남',/화나|빡쳤|짜증|열받|분노/],['외로움',/외롭|혼자인 것 같|혼자라는 생각/]
  ];
  return [...new Set(rules.filter(([,r])=>r.test(text)).map(([t])=>t))].slice(0,8);
}
function normalizeForMatch`, 'inferTags');

replaceRegex(/function similarityScore\(queryText,queryTags,story\)\{[\s\S]*?\n\}\nfunction bestHistoryMatch/, `function similarityScore(queryText,queryTags,story){
  const text=jaccard(charGrams(queryText),charGrams((story.title||'')+' '+(story.body||'')));
  const storyTags=(story.tags&&story.tags.length)?story.tags:inferTags((story.title||'')+' '+(story.body||''));
  const tags=tagScore(queryTags,storyTags);
  const q=new Set(queryTags||[]), st=new Set(storyTags||[]);
  const topicGroups=currentLang==='en'
    ? ['money','partner','parenting','work','daycare','school','family','housework','sleep']
    : ['돈','남편','육아','육아분담','직장','복직','등원','하원','유치원','어린이집','가족','시댁','친정','집안일','수면'];
  const queryTopics=topicGroups.filter(x=>q.has(x));
  const storyTopics=topicGroups.filter(x=>st.has(x));
  const topicOverlap=queryTopics.filter(x=>st.has(x)).length;
  const hasQueryTopic=queryTopics.length>0;
  const conflictingTopic=hasQueryTopic && storyTopics.length>0 && topicOverlap===0;

  // Topic is the gate. Emotion/text similarity only refines results inside the same topic.
  let score=tags*.58 + text*.12;
  if(topicOverlap>0) score += .30 + Math.min(.12,(topicOverlap-1)*.06);
  if(hasQueryTopic && storyTopics.length===0) score *= .28;
  if(conflictingTopic) score *= .035;
  return Math.min(1,score);
}
function bestHistoryMatch`, 'similarityScore');

// Money should be treated as a primary topic in labels, not after generic family/emotion labels.
s=s.replace("const priority=['남편','육아분담','육아','직장','복직','등원','하원','어린이집','유치원','집안일','수면','시댁','친정','가족','돈','서운함','화남','지침','외로움'];",
            "const priority=['돈','남편','육아분담','육아','직장','복직','등원','하원','어린이집','유치원','집안일','수면','시댁','친정','가족','서운함','화남','지침','외로움'];");
s=s.replace("const priority=['partner','parenting','work','daycare','school','housework','sleep','family','money','overwhelmed','exhausted','hurt','angry','annoyed','lonely'];",
            "const priority=['money','partner','parenting','work','daycare','school','housework','sleep','family','overwhelmed','exhausted','hurt','angry','annoyed','lonely'];");

// Generate a money-specific title so newly created money stories are easier to classify and retrieve.
s=s.replace("  if(/회사|복직|상사|직장|업무/.test(text)) return '회사 생각에 마음이 무거워요';",
`  if(/돈|생활비|카드값?|대출|빚|부채|월세|전세|주거비|소비|지출|예산|저축|월급|연봉|소득|재테크|투자|금전|물가|비용/.test(text)) return '돈 문제 때문에 마음이 무거워요';
  if(/회사|복직|상사|직장|업무/.test(text)) return '회사 생각에 마음이 무거워요';`);

fs.writeFileSync(p,s);
console.log('Applied',changed,'recommendation patches');
