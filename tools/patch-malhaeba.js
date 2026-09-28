const fs=require('fs');
const p='index.html';
let s=fs.readFileSync(p,'utf8');
let changed=0;
function rep(a,b,label){if(!s.includes(a))throw new Error('Patch target not found: '+label);s=s.replace(a,b);changed++;}

// Adult/sexual relationship concerns need to outrank generic partner classification.
rep("    ['남편',/남편|배우자|신랑|아내/],", "    ['19',/19금|섹스|성관계|잠자리|부부관계|성생활|성욕|리스부부|섹스리스|관계를 안|관계가 없|관계 안 한|관계 안한|스킨십이 없|스킨십을 안|성적 만족|성적인|관계 횟수/],\n    ['남편',/남편|배우자|신랑|아내/],", 'adult primary topic');
rep("    ['partner',/husband|wife|partner|spouse|boyfriend|girlfriend/i],", "    ['adult',/sex|sexual|sexless|intimacy|intimate|haven.?t had sex|physical intimacy|libido/i],\n    ['partner',/husband|wife|partner|spouse|boyfriend|girlfriend/i],", 'adult primary topic en');

rep("  if(topic==='돈') return '돈 문제 때문에 마음이 무거워요';", "  if(topic==='19') return '부부 관계 때문에 고민이 있어요';\n  if(topic==='돈') return '돈 문제 때문에 마음이 무거워요';", 'adult title');
rep("    if(topic==='money') return 'Money has been weighing on me';", "    if(topic==='adult') return 'I have concerns about intimacy in my relationship';\n    if(topic==='money') return 'Money has been weighing on me';", 'adult title en');

// Broaden secondary tag inference as well.
rep("['19',/섹스|성관계|잠자리|부부관계/]", "['19',/19금|섹스|성관계|잠자리|부부관계|성생활|성욕|리스부부|섹스리스|관계를 안|관계가 없|관계 안 한|관계 안한|스킨십이 없|스킨십을 안|성적 만족|성적인|관계 횟수/]", 'adult tag inference');

// Recommendation topic gate must recognize adult as a first-class topic.
rep("    : ['돈','남편','육아','육아분담','직장','복직','등원','하원','유치원','어린이집','가족','시댁','친정','집안일','수면'];", "    : ['19','돈','남편','육아','육아분담','직장','복직','등원','하원','유치원','어린이집','가족','시댁','친정','집안일','수면'];", 'adult recommendation topic');
rep("    ? ['money','partner','parenting','work','daycare','school','family','housework','sleep']", "    ? ['adult','money','partner','parenting','work','daycare','school','family','housework','sleep']", 'adult recommendation topic en');

fs.writeFileSync(p,s);
console.log('Applied',changed,'adult-topic patches');
