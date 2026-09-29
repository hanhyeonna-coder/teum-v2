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


// Cloudflare Turnstile CAPTCHA for Supabase Auth.
// Site key is public; Supabase stores the secret separately.
rep("async function ensureSession(){", `const TURNSTILE_SITE_KEY='0x4AAAAAAFIrqgACJf0-ZCa0';
async function getCaptchaToken(){
  if(!window.turnstile) throw new Error('CAPTCHA is still loading. Please try again.');
  let host=document.getElementById('malhaeba-turnstile');
  if(!host){
    host=document.createElement('div');
    host.id='malhaeba-turnstile';
    host.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:100000;background:#fff;padding:16px;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.18)';
    document.body.appendChild(host);
  }
  host.style.display='block';
  return await new Promise((resolve,reject)=>{
    let done=false;
    const timer=setTimeout(()=>{if(!done){done=true;host.style.display='none';reject(new Error('CAPTCHA timeout'));}},30000);
    turnstile.render(host,{
      sitekey:TURNSTILE_SITE_KEY,
      theme:'light',
      callback:(token)=>{if(done)return;done=true;clearTimeout(timer);host.style.display='none';host.innerHTML='';resolve(token);},
      'error-callback':()=>{if(done)return;done=true;clearTimeout(timer);host.style.display='none';host.innerHTML='';reject(new Error('CAPTCHA failed'));},
      'expired-callback':()=>{}
    });
  });
}
async function ensureSession(){`, 'captcha helper');

rep("    const {data,error}=await sb.auth.signInAnonymously();", "    const captchaToken=await getCaptchaToken();\n    const {data,error}=await sb.auth.signInAnonymously({options:{captchaToken}});", 'anonymous auth captcha');

rep("async function linkEmailAccount(){", "async function captchaSignInWithOtp(email,options){\n  const captchaToken=await getCaptchaToken();\n  return sb.auth.signInWithOtp({email,options:{...(options||{}),captchaToken}});\n}\nasync function linkEmailAccount(){", 'otp captcha helper');

s=s.replaceAll("await sb.auth.signInWithOtp({email:accountOtpEmail,options:{shouldCreateUser:false}})", "await captchaSignInWithOtp(accountOtpEmail,{shouldCreateUser:false})");
s=s.replaceAll("await sb.auth.signInWithOtp({\n      email,\n      options:{\n        shouldCreateUser:false,\n        emailRedirectTo:location.origin+'/?account_login=1'\n      }\n    })", "await captchaSignInWithOtp(email,{shouldCreateUser:false,emailRedirectTo:location.origin+'/?account_login=1'})");
s=s.replaceAll("await sb.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+'/?account_login=1'}})", "await captchaSignInWithOtp(email,{shouldCreateUser:true,emailRedirectTo:location.origin+'/?account_login=1'})");

rep("</head>", "  <script src=\"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit\" async defer></script>\n</head>", 'turnstile script');


// Existing email fix: one connect action should fall back to sign-in and preserve anonymous data for transfer.
rep("      const rateLimited=error.code==='over_email_send_rate_limit' || error.status===429;\n      accountLinkStatus.textContent=rateLimited", "      const rateLimited=error.code==='over_email_send_rate_limit' || error.status===429;\n      const emailTaken=error.code==='email_exists' || error.code==='user_already_exists' || /already.*registered|already.*exists|email.*exists/i.test(String(error.message||''));\n      if(emailTaken){\n        if(currentUser?.is_anonymous){\n          try{\n            const {data:transferData,error:transferError}=await sb.functions.invoke('account-transfer',{body:{action:'prepare'}});\n            if(!transferError && transferData?.token) localStorage.setItem('malhaebaAccountTransferToken',transferData.token);\n          }catch(e){console.error('account transfer prepare',e)}\n        }\n        const {error:loginError}=await captchaSignInWithOtp(email,{shouldCreateUser:false,emailRedirectTo:location.origin+'/?account_login=1'});\n        if(!loginError){\n          showAccountOtp('login',email);\n          accountLinkStatus.textContent=currentLang==='en'?'This email already has an account. I sent a sign-in code; your current anonymous activity will be carried over after sign-in.':'이미 가입된 이메일이에요. 로그인 코드를 보냈어요. 로그인 후 지금 익명으로 쓴 기록도 이어서 가져올게요.';\n          return;\n        }\n        console.error(loginError);\n      }\n      accountLinkStatus.textContent=rateLimited", 'existing email connect fallback');
