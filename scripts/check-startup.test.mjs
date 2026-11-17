import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
function startsWhenLoaded(code) {
  return new Promise((resolve,reject) => {
    const child=spawn(process.execPath,['-e',code],{cwd:root,env:{...process.env,PORT:'0'}});
    let output='';
    const timer=setTimeout(()=>{child.kill();reject(new Error('Startup timed out: '+output));},5000);
    child.stdout.on('data',chunk=>{
      output+=chunk;
      if(output.includes('ProRack website and RackBot API listening')) {clearTimeout(timer);child.kill();resolve();}
    });
    child.stderr.on('data',chunk=>output+=chunk);
    child.on('error',error=>{clearTimeout(timer);reject(error);});
    child.on('exit',code=>{clearTimeout(timer);if(!output.includes('ProRack website and RackBot API listening')) reject(new Error('Entry did not start the HTTP server: '+code+' '+output));});
  });
}
test('managed launcher importing the entry starts the HTTP listener',async()=>{
  await startsWhenLoaded("import('./server.mjs')");
});
