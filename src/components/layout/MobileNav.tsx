import React from 'react';
import { useAppData, AppView } from '../../context/AppDataContext';
import { X, ShieldCheck, Search, History, BookmarkCheck, AlertOctagon, Radio, BookOpen, Sparkles, User, Code2, HelpCircle } from 'lucide-react';

interface MobileNavProps { isOpen: boolean; onClose: () => void; }
const items: {id: AppView; label: string; icon: React.ElementType}[] = [
  {id:'landing',label:'Home',icon:ShieldCheck}, {id:'scan',label:'Scan & Analyse',icon:Search}, {id:'watchlist',label:'Site Intelligence',icon:BookmarkCheck}, {id:'incident-check',label:'Got Scammed?',icon:AlertOctagon}, {id:'threat-pulse',label:'Threat Radar',icon:Radio}, {id:'learn',label:'Learn',icon:BookOpen}, {id:'history',label:'Security History',icon:History}, {id:'membership',label:'Membership',icon:Sparkles}, {id:'help-center',label:'Help Center',icon:HelpCircle}, {id:'profile',label:'Profile & Privacy',icon:User}, {id:'developers',label:'Developers',icon:Code2},
];
export const MobileNav: React.FC<MobileNavProps> = ({isOpen,onClose}) => {
  const {activeView,navigateTo}=useAppData();
  if(!isOpen)return null;
  return <div className="cp-mobile-nav-overlay fixed inset-0 z-[70]" role="dialog" aria-modal="true"><button className="absolute inset-0 w-full h-full bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-label="Close navigation" /><aside className="cp-mobile-drawer"><div className="cp-mobile-drawer-head"><button onClick={()=>navigateTo('landing')} className="cp-brand"><span className="cp-brand-mark"><ShieldCheck className="w-5 h-5"/></span><span><strong>CYBERPROOF</strong><small>Digital Trust Engine</small></span></button><button type="button" onClick={onClose} aria-label="Close menu"><X className="w-5 h-5"/></button></div><div className="p-3 space-y-1 overflow-y-auto">{items.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{navigateTo(item.id);onClose()}} className={`cp-mobile-nav-item ${activeView===item.id?'active':''}`}><Icon className="w-5 h-5"/><span>{item.label}</span></button>})}</div><div className="cp-mobile-drawer-foot">Pause • Check • Protect</div></aside></div>;
};
