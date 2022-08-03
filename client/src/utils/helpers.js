export const getRemainingTime = (expiration, created = null) => {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let remaining = expiration.getTime() - created.getTime();
  let expiration_time = `${expiration.toLocaleString('en-us', {hour: 'numeric', minute: 'numeric', hour12:true}) }`;
  let expiration_date = `${expiration.toLocaleString('en-us', {month: 'short', day: 'numeric'}) }`;
  let remaining_min =  (remaining/msPerHour - Math.floor(remaining/msPerHour))*60
  
  if (remaining < msPerMinute) return `${expiration_date} | ${expiration_time.replace(' ','').toLowerCase()} | ${Math.floor(remaining/1000)}s`;  
  else if (remaining < msPerHour) return `${expiration_date} | ${expiration_time.replace(' ','').toLowerCase()} | ${Math.floor(remaining/msPerMinute)}m`;
  else if (remaining < msPerHour * 24) return `${expiration_date} | ${expiration_time.replace(' ','').toLowerCase()} | ${Math.floor(remaining/msPerHour)}h ${ Math.floor(remaining_min) }m`; 
  else if(remaining < msPerDay * 7) return `${expiration_date} | ${expiration_time.replace(' ','').toLowerCase()} | ${Math.floor(remaining/msPerDay)}d`;
  else if(remaining < msPerDay * 28) return `${expiration_date} | ${expiration_time.replace(' ','').toLowerCase()} | ${Math.floor(remaining/(msPerDay*7))}W`;
  else return `${expiration_date} | ${expiration_time.replace(' ','').toLowerCase()} | ${Math.floor(remaining/(msPerDay*28))}M`;
};

export const getElapsedTime = (release_date) => {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerYear = msPerDay * 365;
  let current = new Date(Date.now())
  let elapsed = current.getTime() - release_date.getTime();

  if (elapsed < msPerMinute) return Math.floor(elapsed/1000) + ' s';  
  else if (elapsed < msPerHour) return Math.floor(elapsed/msPerMinute) + 'm ago';   
  else if (elapsed < msPerDay ) return Math.floor(elapsed/msPerHour ) + 'h ago';  
  else if(elapsed < msPerDay * 7) return Math.floor(elapsed/msPerDay) + 'd ago';
  else if(elapsed < msPerDay * 11) return '1w ago';
  else if(elapsed < msPerDay * 18) return '2w ago';
  else if(elapsed < msPerDay * 24) return '3w ago';
  else if (elapsed < msPerYear) return release_date.toLocaleString('default', { month: 'short' }) +' '+ release_date.getDate();
  else return release_date.toLocaleString('default', { month: 'short' }) +' '+ release_date.getDate() +', '+release_date.getFullYear();
};

export const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
};