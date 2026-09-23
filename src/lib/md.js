import { marked } from 'marked';
export const md = (s = '') => marked.parse(s || '');
export const mdi = (s = '') => marked.parseInline(s || '');
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const fmtMonth = (d = '') => { const [y, m] = String(d).split('-'); return m ? `${MONTHS[+m - 1]} ${y}` : y; };
export const fmtDay = (d = '') => { const [y, m, dd] = String(d).split('-'); return dd ? `${dd}-${m}-${y}` : fmtMonth(d); };
export const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));
export const ABBR = {"Adv. Funct. Mater.":"Adv. Funct. Mater.","Opt. Mater. Express":"OMEx","Phys. Rev. Research":"PRR","ACS Photonics":"ACS Photon.","Sci. Adv.":"Sci. Adv.","Optica Quantum":"Optica Q.","Phys. Rev. Lett.":"PRL","Nano Lett.":"Nano Lett.","npj 2D Mater. Appl.":"npj 2D","2D Mater.":"2D Mater.","Opt. Lett.":"Opt. Lett.","Nat. Photon.":"Nat. Photon.","Nat. Commun.":"Nat. Commun.","Phys. Rev. B":"PRB","Optica":"Optica"};
export const pid = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
