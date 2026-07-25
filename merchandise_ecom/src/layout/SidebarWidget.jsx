export default function SidebarWidget() {
    return (<div className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-brand-50/50 p-4 text-center dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40`}>
      <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-brand-500/10 text-brand-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
        </svg>
      </div>
      <h3 className="mb-1 font-semibold text-gray-900 text-theme-sm dark:text-white">
        Custom Print Engine
      </h3>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        DTF, Screen Printing & Sublimation Order Management System
      </p>
      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        API Connected
      </div>
    </div>);
}
