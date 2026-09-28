const fs=require('fs');
const p='index.html';
let s=fs.readFileSync(p,'utf8');
let changed=0;
function rep(a,b,label){if(!s.includes(a))throw new Error('Patch target not found: '+label);s=s.replace(a,b);changed++;}

// Specific family relationship topics outrank generic family.
rep("    ['가족',/시댁|시어머니|시아버지|친정|친정엄마|친정아빠|부모님|가족/],", "    ['시댁',/시댁|시어머니|시어머님|시아버지|시아버님|시부모|시부모님|며느리/],\n    ['친정',/친정|친정엄마|친정아빠|친정부모|친정부모님/],\n    ['가족',/부모님|가족/],", 'specific family primary topics');

rep("  if(topic==='가족') return '가족 때문에 마음이 무거워요';", "  if(topic==='시댁') return '시댁 때문에 마음이 복잡해요';\n  if(topic==='친정') return '친정 때문에 마음이 복잡해요';\n  if(topic==='가족') return '가족 때문에 마음이 무거워요';", 'specific family titles');

// Recommendation: primary topic is a hard preference. A generic family tag must not compete with a specific in-law topic.
rep("  const queryTopics=topicGroups.filter(x=>q.has(x));\n  const storyTopics=topicGroups.filter(x=>st.has(x));", "  const queryPrimary=primaryTopic(queryText);\n  const storyPrimary=primaryTopic((story.title||'')+' '+(story.body||'')) || storyTags[0] || '';\n  const queryTopics=topicGroups.filter(x=>q.has(x));\n  const storyTopics=topicGroups.filter(x=>st.has(x));", 'primary recommendation context');
rep("  if(topicOverlap>0) score += .30 + Math.min(.12,(topicOverlap-1)*.06);", "  if(topicOverlap>0) score += .30 + Math.min(.12,(topicOverlap-1)*.06);\n  if(queryPrimary && storyPrimary===queryPrimary) score += .38;\n  else if(queryPrimary && storyPrimary && queryPrimary!==storyPrimary) score *= .12;", 'primary recommendation boost');

fs.writeFileSync(p,s);
console.log('Applied',changed,'in-law classification/recommendation patches');
