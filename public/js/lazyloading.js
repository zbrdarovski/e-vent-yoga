  // Izberemo vse slike s CSS razredom lazy-image
        const lazyImages = document.querySelectorAll('.lazy-image');

        // Konfiguracija za opazovalca
        const options = {
            root: null, // Uporabljamo viewport kot root element
            rootMargin: '0px', // Ničelni rob
            threshold: 0.1 // Količina vidljivosti, pri kateri se sproži opazovanje
        };

        // Funkcija za nalaganje slike
        function lazyLoadImage(target) {
            // Preverimo, ali ima ciljni element atribut data-src
            if (target.dataset.src) {
                target.src = target.dataset.src; // Naložimo sliko
                target.removeAttribute('data-src'); // Odstranimo atribut data-src
            }
        }

        // Ustvarimo nov opazovalec
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Preverimo, ali je ciljni element v vidnem območju
                if (entry.isIntersecting) {
                    // Kličemo funkcijo za leno nalaganje slike
                    lazyLoadImage(entry.target);
                    // Ne opazujemo več ciljnega elementa
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Opazujemo vsako leno nalaganje slike
        lazyImages.forEach(image => {
            observer.observe(image);
        });