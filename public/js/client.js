document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const ime = formData.get('ime');
    const priimek = formData.get('priimek');
    const leta = formData.get('leta');
    const eposta = formData.get('eposta');
    
    try {
        const response = await fetch('/User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ime, priimek, leta, eposta })
        });
        
        if (!response.ok) {
            throw new Error('Neuspešno dodajanje uporabnika');
        }
        
        const data = await response.json();
        console.log('Uporabnik uspešno dodan:', data);
        // Add code here to display a success message or update the UI
    } catch (error) {
        console.error('Napaka pri dodajanju uporabnika:', error);
        // Add code here to display an error message
    }
});
