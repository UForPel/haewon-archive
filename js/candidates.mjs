const TYPES = new Set(['video','photo','news','social','fan-content','other']);
export function normalizeCandidate(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('자료 항목이 올바르지 않습니다.');
  const title=String(entry.title??'').trim(), sourceName=String(entry.sourceName??'').trim(), type=String(entry.type??'other');
  const notes=String(entry.notes??'').trim(), rawUrl=String(entry.url??'').trim(), publishedAt=String(entry.publishedAt??'').trim();
  if (!title || title.length>160) throw new Error('제목은 1~160자로 입력해 주세요.');
  if (!sourceName || sourceName.length>100) throw new Error('출처는 1~100자로 입력해 주세요.');
  if (!TYPES.has(type)) throw new Error('자료 유형을 확인해 주세요.');
  if (notes.length>500) throw new Error('메모는 500자 이내입니다.');
  let url; try { url=new URL(rawUrl); } catch { throw new Error('URL을 확인해 주세요.'); }
  if(url.protocol!=='https:'||url.username||url.password) throw new Error('HTTPS 링크만 등록할 수 있습니다.');
  if(publishedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)||Number.isNaN(Date.parse(publishedAt+'T00:00:00Z'))||new Date(publishedAt+'T00:00:00Z').toISOString().slice(0,10)!==publishedAt)) throw new Error('게시 날짜를 확인해 주세요.');
  return {id:String(entry.id??'').trim(),type,title,sourceName,url:url.href,publishedAt,notes,status:'review'};
}
export function validateCandidates(items) {
  if(!Array.isArray(items)) throw new Error('자료 목록은 배열이어야 합니다.');
  const seen=new Set();
  return items.map((item,i)=>{let normalized;try{normalized=normalizeCandidate(item)}catch(e){throw new Error((i+1)+'번 자료: '+e.message)}
    const key=normalized.url.toLowerCase();if(seen.has(key))throw new Error('중복 링크가 있습니다: '+normalized.url);seen.add(key);return normalized;});
}
export function mergeCandidates(base, additions) {
  const map=new Map(); for(const item of [...validateCandidates(base),...validateCandidates(additions)]) map.set(item.url.toLowerCase(),item);
  return [...map.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}