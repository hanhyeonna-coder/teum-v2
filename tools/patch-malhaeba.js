const fs=require('fs');
const p='index.html';
let s=fs.readFileSync(p,'utf8');
let changed=0;
function rep(a,b){if(!s.includes(a))throw new Error('Patch target not found: '+a.slice(0,80));s=s.replace(a,b);changed++;}
rep("    const {error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+'/?account_login=1'}});",
`    if(currentUser?.is_anonymous){
      const {data:transferData,error:transferError}=await sb.functions.invoke('account-transfer',{body:{action:'prepare'}});
      if(transferError||!transferData?.token) throw transferError||new Error('Could not prepare account transfer');
      localStorage.setItem('malhaebaAccountTransferToken',transferData.token);
    }
    const {error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+'/?account_login=1'}});`);
rep("    if(data?.user) currentUser=data.user;",
`    if(data?.user) currentUser=data.user;
    if(accountOtpMode==='login'){
      const transferToken=localStorage.getItem('malhaebaAccountTransferToken');
      if(transferToken){
        const {data:claimData,error:claimError}=await sb.functions.invoke('account-transfer',{body:{action:'claim',token:transferToken}});
        if(claimError||!claimData?.ok){
          console.error('account transfer:',claimError||claimData);
          accountLinkStatus.textContent=currentLang==='en'?'Signed in, but we could not move the story you just shared. Please contact us.':'로그인은 됐지만 방금 작성한 이야기를 계정으로 옮기지 못했어요. 말해바에 알려주세요.';
          return;
        }
        localStorage.removeItem('malhaebaAccountTransferToken');
      }
    }`);
fs.writeFileSync(p,s);
console.log('Applied',changed,'Malhaeba patches');
