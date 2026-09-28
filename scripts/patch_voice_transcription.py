from pathlib import Path

path = Path('index.html')
html = path.read_text(encoding='utf-8')

marker = '/* MALHAEBA_OPENAI_VOICE_V1 */'
if marker in html:
    print('Voice transcription patch already present')
    raise SystemExit(0)

needle = '\n</script>\n</body>'
if needle not in html:
    raise SystemExit('Could not find final script closing marker')

patch = r'''

/* MALHAEBA_OPENAI_VOICE_V1 */
let malhaebaMediaRecorder=null;
let malhaebaMediaStream=null;
let malhaebaAudioChunks=[];
let malhaebaRecordingStartedAt=0;
let malhaebaRecordingElapsed=0;
let malhaebaStopResolve=null;
let malhaebaTranscribing=false;

function malhaebaPickAudioMime(){
  const choices=['audio/webm;codecs=opus','audio/webm','audio/mp4'];
  return choices.find(t=>window.MediaRecorder?.isTypeSupported?.(t))||'';
}
function malhaebaReleaseMic(){
  try{malhaebaMediaStream?.getTracks().forEach(t=>t.stop())}catch(e){}
  malhaebaMediaStream=null;
}
function malhaebaStopRecorder(){
  return new Promise(resolve=>{
    if(!malhaebaMediaRecorder || malhaebaMediaRecorder.state==='inactive'){resolve();return}
    malhaebaStopResolve=resolve;
    try{malhaebaMediaRecorder.stop()}catch(e){resolve()}
  });
}
async function malhaebaBeginRecorder(){
  if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){
    throw new Error('recording_unsupported');
  }
  malhaebaMediaStream=await navigator.mediaDevices.getUserMedia({audio:true});
  malhaebaAudioChunks=[];
  const mimeType=malhaebaPickAudioMime();
  malhaebaMediaRecorder=new MediaRecorder(malhaebaMediaStream,mimeType?{mimeType}:undefined);
  malhaebaMediaRecorder.ondataavailable=e=>{if(e.data?.size)malhaebaAudioChunks.push(e.data)};
  malhaebaMediaRecorder.onstop=()=>{
    malhaebaReleaseMic();
    if(malhaebaStopResolve){malhaebaStopResolve();malhaebaStopResolve=null}
  };
  malhaebaMediaRecorder.start(1000);
  malhaebaRecordingStartedAt=Date.now();
}
async function malhaebaTranscribe(){
  if(!malhaebaAudioChunks.length) return '';
  const type=malhaebaMediaRecorder?.mimeType||'audio/webm';
  const ext=type.includes('mp4')?'m4a':'webm';
  const blob=new Blob(malhaebaAudioChunks,{type});
  const form=new FormData();
  form.append('file',blob,`recording.${ext}`);
  const {data,error}=await sb.functions.invoke('transcribe-audio',{body:form});
  if(error) throw error;
  return (data?.text||'').trim();
}

startVoice=async function(){
  resetCompose();
  show('voice');
  voicePaused=false;
  voiceTranscript='';
  committedVoiceText='';
  voiceElapsedMs=0;
  voiceSegmentStartedAt=0;
  voiceWarned=false;
  malhaebaRecordingElapsed=0;
  malhaebaTranscribing=false;
  clearVoiceLimitTimer();
  voiceToggleBtn.innerHTML='<span class="pauseGlyph" aria-hidden="true"><i></i><i></i></span>';
  beginVoiceHints();
  startListenerAnimation();
  try{
    await malhaebaBeginRecorder();
    startVoiceLimitSegment();
  }catch(e){
    console.error('Microphone start failed:',e);
    clearInterval(voiceHintTimer);
    stopListenerAnimation();
    setVoiceHint(currentLang==='en'?'Microphone access is needed to record.':'녹음하려면 마이크 접근을 허용해주세요.');
  }
};

toggleVoicePause=function(){
  if(!malhaebaMediaRecorder || malhaebaTranscribing) return;
  if(!voicePaused){
    clearInterval(voiceHintTimer);
    stopListenerAnimation();
    pauseVoiceLimitSegment();
    try{if(malhaebaMediaRecorder.state==='recording')malhaebaMediaRecorder.pause()}catch(e){}
    voicePaused=true;
    voiceToggleBtn.innerHTML='<span class="recordGlyph" aria-hidden="true"></span>';
    setVoiceHint(tr('pause'));
  }else{
    voicePaused=false;
    try{if(malhaebaMediaRecorder.state==='paused')malhaebaMediaRecorder.resume()}catch(e){}
    voiceToggleBtn.innerHTML='<span class="pauseGlyph" aria-hidden="true"><i></i><i></i></span>';
    beginVoiceHints();
    startListenerAnimation();
    startVoiceLimitSegment();
  }
};

stopVoice=async function(reachedLimit=false){
  if(malhaebaTranscribing) return;
  malhaebaTranscribing=true;
  clearInterval(voiceHintTimer);
  clearTimeout(voiceHintSwapTimer);
  pauseVoiceLimitSegment();
  stopListenerAnimation();
  voicePaused=false;
  const finishBtn=document.querySelector('#voice .voiceControls .primary');
  const oldLabel=finishBtn?.textContent;
  if(finishBtn){finishBtn.disabled=true;finishBtn.textContent=currentLang==='en'?'Turning your voice into text…':'말한 내용을 글로 옮기는 중…'}
  setVoiceHint(currentLang==='en'?'Listening back for a moment…':'잠시만요, 말한 내용을 정리하고 있어요…');
  try{
    await malhaebaStopRecorder();
    voiceTranscript=await malhaebaTranscribe();
    draft.body=voiceTranscript.trim();
    reviewBody.value=draft.body||tr('voiceEmpty');
    if(draft.body)localStorage.setItem('malhaebaWriteDraft',draft.body);
    show('review');
    if(reachedLimit){
      setTimeout(()=>alert(currentLang==='en'?'Voice input can be recorded for up to 5 minutes. You can keep editing the text.':'음성 입력은 최대 5분까지 녹음할 수 있어요. 이어서 글로 수정할 수 있어요.'),50);
    }
  }catch(e){
    console.error('Transcription failed:',e);
    setVoiceHint(currentLang==='en'?'I could not turn that recording into text. Please try once more.':'음성을 글로 옮기지 못했어요. 한 번만 다시 시도해주세요.');
  }finally{
    malhaebaTranscribing=false;
    if(finishBtn){finishBtn.disabled=false;finishBtn.textContent=oldLabel||'말하기 끝'}
  }
};

redoVoice=async function(){
  clearInterval(voiceHintTimer);
  clearTimeout(voiceHintSwapTimer);
  pauseVoiceLimitSegment();
  stopListenerAnimation();
  try{await malhaebaStopRecorder()}catch(e){}
  malhaebaReleaseMic();
  malhaebaAudioChunks=[];
  voiceTranscript='';
  committedVoiceText='';
  draft={body:'',title:'',privacy:'public'};
  startVoice();
};
'''

html = html.replace(needle, patch + needle, 1)
path.write_text(html, encoding='utf-8')
print('Patched index.html with OpenAI voice transcription')
