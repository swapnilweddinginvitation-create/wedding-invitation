document.addEventListener('DOMContentLoaded', () => {

    // 1. Particle Effects for Hero Section
    const particlesContainer = document.getElementById('particles');

    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 5 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.bottom = `-10px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);
        }

        for (let i = 0; i < 15; i++) {
            const petal = document.createElement('div');
            petal.classList.add('particle-petal');
            const size = Math.random() * 15 + 10;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.left = `${left}%`;
            petal.style.top = `-20px`;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(petal);
        }
    }

    createParticles();

    // 2. Open Invitation Button & Audio Logic
    const openInviteBtn = document.getElementById('openInviteBtn');
    const heroSection = document.getElementById('home');
    const mainContent = document.getElementById('mainContent');
    const floatingControls = document.querySelector('.floating-controls');

    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    let isMusicPlaying = false;

    // Attempt immediate autoplay on load
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggleBtn.classList.add('playing');
    }).catch(err => {
        console.log("Immediate autoplay blocked, waiting for interaction...");
    });

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggleBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.log("Audio play prevented:", e));
            musicToggleBtn.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggleBtn.addEventListener('click', toggleMusic);

    let hasOpened = false;

    function openInvitation() {
        if (hasOpened) return;
        hasOpened = true;

        // Slide up hero section
        heroSection.classList.add('slide-up');

        // Try to play music automatically on first interaction
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggleBtn.classList.add('playing');
        }).catch(err => {
            console.log("Auto-play blocked by browser, user needs to click the music button.", err);
        });

        // Show main content
        mainContent.style.display = 'block';

        setTimeout(() => {
            mainContent.style.opacity = '1';
            floatingControls.classList.add('visible');
            reveal();
            document.getElementById('invitation').scrollIntoView({ behavior: 'smooth' });

            // Start automatic slow scroll after giving user a moment to read
            setTimeout(startAutoScroll, 3000);
        }, 800);

        setTimeout(() => {
            heroSection.style.display = 'none';
            window.scrollTo(0, 0);
        }, 1000);
    }

    openInviteBtn.addEventListener('click', openInvitation);

    // Global listener to play music on first user interaction if blocked
    function playAudioOnInteraction() {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggleBtn.classList.add('playing');
                // Remove listeners once playing
                document.removeEventListener('click', playAudioOnInteraction);
                document.removeEventListener('touchstart', playAudioOnInteraction);
                document.removeEventListener('scroll', playAudioOnInteraction);
            }).catch(err => console.log("Audio still blocked:", err));
        }
    }

    document.addEventListener('click', playAudioOnInteraction);
    document.addEventListener('touchstart', playAudioOnInteraction);
    document.addEventListener('scroll', playAudioOnInteraction);

    // Auto open after 5 seconds
    setTimeout(() => {
        if (!hasOpened) {
            openInvitation();
        }
    }, 5000);

    // 3. Scroll Reveal Animation
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal();

    // 3.5 Auto Scroll Logic (Continuous Flow)
    let autoScrollFrame;
    let isAutoScrolling = false;

    function startAutoScroll() {
        if (isAutoScrolling) return;
        isAutoScrolling = true;

        function scrollLoop() {
            if (!isAutoScrolling) return;

            // Stop if reached the bottom
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
                stopAutoScroll();
                return;
            }

            // Scroll down continuously by a small amount per frame
            // Increased speed for mobile (Android) views, adjusted to be slower as requested
            const scrollSpeed = window.innerWidth <= 768 ? 1.5 : 2.5;
            window.scrollBy(0, scrollSpeed);

            autoScrollFrame = requestAnimationFrame(scrollLoop);
        }

        // Start the continuous flow after an initial reading pause
        setTimeout(() => {
            if (isAutoScrolling) {
                autoScrollFrame = requestAnimationFrame(scrollLoop);
            }
        }, 2000);
    }

    function stopAutoScroll() {
        if (!isAutoScrolling) return;
        isAutoScrolling = false;
        cancelAnimationFrame(autoScrollFrame);
    }

    // Stop auto-scroll if user manually scrolls, touches the screen, or clicks
    window.addEventListener('wheel', stopAutoScroll, { passive: true });
    window.addEventListener('touchstart', stopAutoScroll, { passive: true });
    window.addEventListener('mousedown', stopAutoScroll, { passive: true });

    // 4. Countdown Timer Logic
    const weddingDate = new Date("October 04, 2026 19:15:00").getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown').innerHTML = "<h3 style='color:var(--clr-primary);'>We are Married!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? '0' + days : days;
        hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        minsEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        secsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);

    // 5. Add to Calendar Links Generation
    const createCalUrl = (title, details, location, startDate, endDate) => {
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${startDate}/${endDate}`;
    };

    const addCalBtns = document.querySelectorAll('.add-cal');

    if (addCalBtns.length >= 3) {
        // Haldi (03 Oct 2026, 1 PM - 5 PM)
        addCalBtns[0].href = createCalUrl("Swapnil & Akanksha's Haldi", "Join us for the Haldi ceremony!", "SAKHUMAI NIWAS, Akola", "20261003T073000Z", "20261003T113000Z");

        // Baraat (03 Oct 2026, 6:30 PM - 10:30 PM)
        addCalBtns[1].href = createCalUrl("Swapnil & Akanksha's Baraat", "Join us for the Baraat!", "SAKHUMAI NIWAS, Akola", "20261003T130000Z", "20261003T170000Z");

        // Wedding (04 Oct 2026, 7:15 PM - 11:30 PM)
        addCalBtns[2].href = createCalUrl("Swapnil & Akanksha's Wedding", "Join us as we tie the knot!", "Vyankatesh Lawns & Mangal Karyalaya, Akola", "20261004T134500Z", "20261004T180000Z");

        addCalBtns.forEach(btn => btn.target = "_blank");
    }
});
