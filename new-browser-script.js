
  {
    const DELAY_SAY_WAIT = 300;
    const API = 'https://sounds.musicmodeabc.xyz/v1';
    const TokenURL = () => new URL(`${API}/token`);
    const PayURL = () => new URL(`${API}/paid`);
    const StartURL = () => new URL(`${API}/start`);
    const Steps = [
      {
        url: TokenURL,
        request: () => ({
          method: 'POST'
        })
      },
      {
        url: PayURL,
        request: token => ({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }, 
          body: JSON.stringify({
            payment_intent: 'synthetic-demo'
          })
        })
      },
      {
        url: StartURL,
        request: token => ({
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }, 
        }),
        type: 'json'
      }
    ];
    let locked = false;
    let locking = false;

    self.loadBrowser = loadBrowser;

    async function loadBrowser(event) {
      event.preventDefault();

      event.target.querySelector('button').disabled = true;
      event.target.querySelector('button').innerText = "Making..."

      let failed = false;
      let previous;

      for( const {url,request,type:type = 'text'} of Steps ) {
        const resp = await fetch(url(previous), request(previous));
        if ( resp.error || ! resp.ok ) {
          failed = true;
          const message = `Auth failed (${resp.status}: ${resp.statusText}): ${resp.error || 'error'}`;
          console.warn(message);
          alert(message);
          break;
        }
        const data = await resp[type]();
        previous = data;
      }

      if ( !failed ) {
        const {loginUrl} = previous;
        event.target.querySelector('button').innerText = "Loading..."
        location.href = loginUrl;
        return true;
      } 

      setTimeout(() => {
          event.target.querySelector('button').disabled = false;
          event.target.querySelector('button').innerText = "Server Full :("
          location.href = `/pay.html?message=${encodeURIComponent("Sorry, the server is full. Subscribe now to never see this message again.")}`
        },
        500
      );

      return false;
    }

    async function delaySay(msg) {
      let resolve;
      const pr = new Promise(res => resolve = res);
      setTimeout(() => resolve(alert(`\n  ${msg}\n`)), DELAY_SAY_WAIT);
      return pr;
    }
  }
