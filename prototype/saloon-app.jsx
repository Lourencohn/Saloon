// Saloon — main app shell (navigation state + screen routing)

const { useState: useStateApp } = React;

const SCREENS = {
  S1: window.SaloonScreens1,
  S2: window.SaloonScreens2,
  S3: window.SaloonScreens3,
  S4: window.SaloonScreens4,
};

function SaloonApp({ tweaks }) {
  const [stack, setStack] = useStateApp([{ name: 'onboarding' }]);
  const [tab, setTab]     = useStateApp('home');
  const [favs, setFavs]   = useStateApp({ s1: true, s4: true });
  const [showYE, setShowYE] = useStateApp(true);
  const [showYEModal, setShowYEModal] = useStateApp(false);

  const cur = stack[stack.length - 1];

  const go = (name, ...args) => {
    if (name === 'home' || name === 'bookings' || name === 'profile' || name === 'search') {
      if (name === 'search') {
        setStack(s => [...s, { name: 'search' }]);
        return;
      }
      setTab(name);
      setStack([{ name: 'tabs' }]);
      return;
    }
    let entry = { name };
    if (name === 'salon')     entry.salonId = args[0];
    if (name === 'select')    { entry.salonId = args[0]; entry.preset = args[1]; }
    if (name === 'calendar')  { entry.salonId = args[0]; entry.selected = args[1]; entry.pro = args[2]; }
    if (name === 'confirm')   { entry.salonId = args[0]; entry.selected = args[1]; entry.pro = args[2]; entry.when = args[3]; }
    if (name === 'review')    entry.bookingId = args[0];
    setStack(s => [...s, entry]);
  };
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);

  const toggleFav = (id) => setFavs(f => ({ ...f, [id]: !f[id] }));

  // Onboarding screen alone
  if (cur.name === 'onboarding') {
    return (
      <PhoneShell>
        <SCREENS.S1.StatusBar/>
        <SCREENS.S1.ScreenOnboarding onDone={() => setStack([{ name: 'tabs' }])}/>
        <SCREENS.S1.GestureBar/>
      </PhoneShell>
    );
  }

  // Routed views above tabs
  let routedScreen = null;
  if (cur.name === 'salon')    routedScreen = <SCREENS.S2.ScreenSalon salonId={cur.salonId} go={go} back={back} favs={favs} toggleFav={toggleFav}/>;
  if (cur.name === 'search')   routedScreen = <SCREENS.S2.ScreenSearch go={go} back={back} favs={favs} toggleFav={toggleFav}/>;
  if (cur.name === 'select')   routedScreen = <SCREENS.S3.ScreenSelect salonId={cur.salonId} presetService={cur.preset} go={go} back={back}/>;
  if (cur.name === 'calendar') routedScreen = <SCREENS.S3.ScreenCalendar salonId={cur.salonId} selected={cur.selected} pro={cur.pro} go={go} back={back}/>;
  if (cur.name === 'confirm')  routedScreen = <SCREENS.S3.ScreenConfirm salonId={cur.salonId} selected={cur.selected} pro={cur.pro} when={cur.when} go={go} back={back}/>;
  if (cur.name === 'success')  routedScreen = <SCREENS.S3.ScreenSuccess go={go}/>;
  if (cur.name === 'review')   routedScreen = <SCREENS.S4.ScreenReview bookingId={cur.bookingId} back={back} go={go}/>;

  if (routedScreen) {
    return (
      <PhoneShell>
        <SCREENS.S1.StatusBar/>
        {routedScreen}
        <SCREENS.S1.GestureBar/>
      </PhoneShell>
    );
  }

  // Tab-rooted shell
  return (
    <PhoneShell>
      <SCREENS.S1.StatusBar/>
      {tab === 'home'     && <SCREENS.S1.ScreenHome go={go} favs={favs} toggleFav={toggleFav}
                                showYearEnd={showYE} dismissYearEnd={() => setShowYE(false)}/>}
      {tab === 'search'   && <SCREENS.S2.ScreenSearch go={go} back={() => setTab('home')} favs={favs} toggleFav={toggleFav}/>}
      {tab === 'bookings' && <SCREENS.S4.ScreenBookings go={go} showYearEnd={showYE}/>}
      {tab === 'profile'  && <SCREENS.S4.ScreenProfile go={go}/>}
      <SCREENS.S1.BottomNav active={tab} onChange={(t) => { setTab(t); setStack([{ name: 'tabs' }]); }}/>
      <SCREENS.S1.GestureBar/>
      {showYEModal && <SCREENS.S4.YearEndModal onClose={() => setShowYEModal(false)} go={go}/>}

      {/* Floating quick-access for year-end demo */}
      {!showYEModal && tab === 'home' && (
        <button onClick={() => setShowYEModal(true)} style={{
          position: 'absolute', right: 18, bottom: 110,
          padding: '10px 14px', borderRadius: 999,
          background: TOKENS.gold, color: '#1A1418',
          border: 'none', cursor: 'pointer',
          fontFamily: TOKENS.sans, fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <Icons.bell size={14}/> Notificação
        </button>
      )}
    </PhoneShell>
  );
}

function PhoneShell({ children }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 44, overflow: 'hidden',
      background: TOKENS.bg,
      border: '10px solid #0A0710',
      boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,230,211,0.06)',
      display: 'flex', flexDirection: 'column', position: 'relative',
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}

window.SaloonApp = SaloonApp;
