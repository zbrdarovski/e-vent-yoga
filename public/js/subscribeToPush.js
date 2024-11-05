if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(swReg => {
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
          //  applicationServerKey: '<vapid kljuc>'
        }).then(subscription => {
            
            fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
            });
        }).catch(error => console.error('Napaka pri naročanju na potisna obvestila: ', error));
    });
}