import React from 'react';
import { useAppData, AppView } from '../../context/AppDataContext';
import { X, ShieldCheck, Search, History, BookmarkCheck, AlertOctagon, Radio, BookOpen, Sparkles, User, Code2, HelpCircle, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MobileNavProps { isOpen: boolean; onClose: () => void; }
const items: {id: AppView; labelKey: string; icon: React.ElementType}[] = [
  {id:'landing',labelKey:'nav.home',icon:ShieldCheck}, {id:'scan',labelKey:'nav.scan',icon:Search}, {id:'dashboard',labelKey:'nav.dashboard',icon:LayoutDashboard}, {id:'watchlist',labelKey:'nav.watchlist',icon:BookmarkCheck}, {id:'incident-check',labelKey:'nav.scammed',icon:AlertOctagon}, {id:'threat-pulse',labelKey:'nav.threat',icon:Radio}, {id:'learn',labelKey:'nav.learn',icon:BookOpen}, {id:'history',labelKey:'history.title',icon:History}, {id:'membership',labelKey:'nav.membership',icon:Sparkles}, {id:'help-center',labelKey:'nav.help',icon:HelpCircle}, {id:'profile',labelKey:'nav.profile',icon:User}, {id:'developers',labelKey:'nav.developers',icon:Code2},
];
export const MobileNav: React.FC<MobileNavProps> = ({isOpen,onClose}) => {
  const {activeView,navigateTo}=useAppData();
  const { t } = useLanguage();
  if(!isOpen)return null;
  return <div className="cp-mobile-nav-overlay fixed inset-0 z-[70]" role="dialog" aria-modal="true"><button className="absolute inset-0 w-full h-full bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-label={t('header.closeMenu')} /><aside className="cp-mobile-drawer"><div className="cp-mobile-drawer-head"><button onClick={()=>navigateTo('landing')} className="cp-brand"><span className="cp-brand-mark"><ShieldCheck className="w-5 h-5"/></span><span><strong>CYBERPROOF</strong><small>{t('header.brandTag')}</small></span></button><button type="button" onClick={onClose} aria-label={t('header.close')}><X className="w-5 h-5"/></button></div><div className="p-3 space-y-1 overflow-y-auto">{items.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{navigateTo(item.id);onClose()}} className={`cp-mobile-nav-item ${activeView===item.id?'active':''}`}><Icon className="w-5 h-5"/><span>{t(item.labelKey)}</span></button>})}</div><div className="cp-mobile-drawer-foot">Pause • Check • Protect</div></aside></div>;
};
