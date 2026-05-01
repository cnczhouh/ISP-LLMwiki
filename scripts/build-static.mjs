#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = new Set(process.argv.slice(2));
const useExample = args.has('--example');
const repository = process.env.GITHUB_REPOSITORY || '';
const [ownerFromRepo, repoFromEnv] = repository.split('/');
const owner = process.env.GITHUB_REPOSITORY_OWNER || ownerFromRepo || 'cnczhouh';
const repoName = repoFromEnv || 'ISP-LLMwiki';
const knowledgeRoot = process.env.KNOWLEDGE_ROOT || (useExample ? './examples/static-knowledge' : './knowledge');
const basePath = process.env.BASE_PATH || `/${repoName}`;
const site = process.env.SITE || `https://${owner}.github.io`;
const astroBin = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'astro.cmd' : 'astro');
const command = process.platform === 'win32' ? 'cmd.exe' : astroBin;
const commandArgs = process.platform === 'win32'
  ? ['/d', '/c', `${astroBin} build`]
  : ['build'];

const env = {
  ...process.env,
  BUILD_MODE: 'static',
  KNOWLEDGE_ROOT: knowledgeRoot,
  BASE_PATH: basePath,
  SITE: site,
};

console.log(`静态构建：${knowledgeRoot}`);
console.log(`站点地址：${site}${basePath === '/' ? '' : basePath}`);

const child = spawn(command, commandArgs, {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
