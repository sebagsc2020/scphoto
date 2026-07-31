// ============================================================
// FUNCIONES DE COOKIES
// ============================================================

// Funciones auxiliares
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ============================================================
// 1. COOKIE BANNER
// ============================================================

function acceptCookies() {
    setCookie('cookie_consent', 'accepted', 365);
    setCookie('analytics_consent', 'accepted', 365);
    setCookie('functional_consent', 'accepted', 365);
    document.getElementById('cookieBanner').classList.remove('active');
    // Activar Google Analytics si estaba desactivado
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
    // Cargar formulario guardado si existe
    loadSavedFormData();
}

function declineCookies() {
    setCookie('cookie_consent', 'declined', 365);
    setCookie('analytics_consent', 'declined', 365);
    setCookie('functional_consent', 'declined', 365);
    document.getElementById('cookieBanner').classList.remove('active');
    // Desactivar Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
    // Eliminar datos guardados del formulario
    deleteCookie('saved_name');
    deleteCookie('saved_email');
    deleteCookie('saved_phone');
}

function showCookiePreferences() {
    openLegalPopup('privacidadPopup');
}

// Verificar si ya hay consentimiento
function checkCookieConsent() {
    const consent = getCookie('cookie_consent');
    if (!consent) {
        // Mostrar banner después de 1 segundo
        setTimeout(() => {
            const banner = document.getElementById('cookieBanner');
            if (banner) banner.classList.add('active');
        }, 1000);
    } else if (consent === 'accepted') {
        // Si ya aceptó, cargar datos guardados
        loadSavedFormData();
        // Actualizar consentimiento de GA
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    } else {
        // Si rechazó, desactivar GA
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }
}

// ============================================================
// 2. GUARDAR DATOS DEL FORMULARIO EN COOKIES
// ============================================================

function saveFormData(name, email, phone) {
    // Solo guardar si el usuario aceptó cookies funcionales
    const functionalConsent = getCookie('functional_consent');
    if (functionalConsent === 'accepted' || getCookie('cookie_consent') === 'accepted') {
        if (name) setCookie('saved_name', name, 30);
        if (email) setCookie('saved_email', email, 30);
        if (phone) setCookie('saved_phone', phone, 30);
    }
}

function loadSavedFormData() {
    const functionalConsent = getCookie('functional_consent');
    if (functionalConsent === 'accepted' || getCookie('cookie_consent') === 'accepted') {
        const name = getCookie('saved_name');
        const email = getCookie('saved_email');
        const phone = getCookie('saved_phone');
        if (name) {
            const nameInput = document.getElementById('waName');
            if (nameInput) nameInput.value = name;
        }
        if (email) {
            const emailInput = document.getElementById('waEmail');
            if (emailInput) emailInput.value = email;
        }
        if (phone) {
            const phoneInput = document.getElementById('waPhone');
            if (phoneInput) phoneInput.value = phone;
        }
    }
}

// ============================================================
// 3. GOOGLE ANALYTICS - CONSENT MODE
// ============================================================

// Inicializar Google Analytics con estado de consentimiento
function initGoogleAnalytics() {
    const consent = getCookie('cookie_consent');
    let analyticsState = 'denied';
    if (consent === 'accepted') {
        analyticsState = 'granted';
    }
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'default', {
            'analytics_storage': analyticsState
        });
    }
}

// ============================================================
// MENÚ HAMBURGUESA
// ============================================================
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!hamburgerBtn || !mobileMenu) return;

    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    const mobileOpenPopupBtn = document.getElementById('mobileOpenPopupBtn');
    if (mobileOpenPopupBtn) {
        mobileOpenPopupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
            openPopupFn();
        });
    }
}

// ============================================================
// POPUPS LEGALES
// ============================================================
function openLegalPopup(id) {
    const popup = document.getElementById(id);
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLegalPopup(id) {
    const popup = document.getElementById(id);
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initLegalPopups() {
    document.querySelectorAll('.legal-popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.legal-popup-overlay.active').forEach(popup => {
                popup.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// ============================================================
// DATOS
// ============================================================
const testimonials = [
    { name: "Laura Méndez", role: "CEO, Puma Energy", text: "NovaCode no solo construyó un sitio web increíble, sino que entendió nuestro negocio y nos ayudó a conectar con nuestros clientes de una manera que nunca imaginamos." },
    { name: "Carlos Herrera", role: "Director de Marketing, BEGA", text: "El equipo de NovaCode es increíblemente profesional. Entregaron un proyecto complejo en tiempo récord y los resultados superaron todas nuestras expectativas." }
];

const projects = [
    { 
        title: "Proyecto Innovación Digital", 
        tag: "Desarrollo Web", 
        desc: "Plataforma digital completa con arquitectura moderna y diseño responsivo de alto impacto.", 
        result: "📈 Incremento del 45% en conversiones", 
        url: "#", 
        image: "images/py1.jpg" 
    },
    { 
        title: "Ecommerce Premium", 
        tag: "Ecommerce", 
        desc: "Tienda online optimizada con experiencia de usuario excepcional y pasarela de pagos integrada.", 
        result: "💰 Ventas incrementadas en un 67%", 
        url: "#", 
        image: "images/py2.jpg" 
    },
    { 
        title: "Portal Corporativo", 
        tag: "Diseño UX/UI", 
        desc: "Rediseño integral de portal corporativo con enfoque en usabilidad y accesibilidad.", 
        result: "👥 Engagement mejorado en un 52%", 
        url: "#", 
        image: "images/py3.jpg" 
    },
    { 
        title: "App Progresiva (PWA)", 
        tag: "Aplicación Web", 
        desc: "Aplicación web progresiva con funcionalidad offline y experiencia nativa.", 
        result: "📱 Adopción móvil del 89%", 
        url: "#", 
        image: "images/py4.jpg" 
    },
    { 
        title: "Plataforma Educativa", 
        tag: "Educación", 
        desc: "Sistema de gestión de aprendizaje con recursos interactivos y seguimiento personalizado.", 
        result: "🎓 Más de 10,000 estudiantes activos", 
        url: "#", 
        image: "images/py5.jpg" 
    },
    { 
        title: "Dashboard Analítico", 
        tag: "Data & Analytics", 
        desc: "Panel de control interactivo con visualización de datos en tiempo real y reportes personalizados.", 
        result: "📊 Toma de decisiones 3x más rápida", 
        url: "#", 
        image: "images/py6.jpg" 
    },
    { 
        title: "Marketplace Multivendor", 
        tag: "Marketplace", 
        desc: "Plataforma de comercio electrónico con múltiples vendedores y gestión automatizada.", 
        result: "🛒 Más de 500 vendedores activos", 
        url: "#", 
        image: "images/py7.jpg" 
    }
];

// ============================================================
// RENDER
// ============================================================
function renderTestimonials() {
    const grid = document.getElementById('testimonialGrid');
    if (!grid) return;
    grid.innerHTML = testimonials.map((t, i) => `
        <div class="testimonial-card" data-index="${i}">
            <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
            <blockquote>“${t.text}”</blockquote>
            <div class="author">
                <div class="avatar"></div>
                <div>
                    <div class="name">${t.name}</div>
                    <div class="role">${t.role || 'Cliente'}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = projects.map((p, i) => {
        const imageHtml = p.image ? `
            <img src="${p.image}" alt="${p.title}" class="project-image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="project-image-placeholder" style="display:none;">
                <i class="fas fa-image"></i> ${p.title}
            </div>
        ` : `
            <div class="project-image-placeholder">
                <i class="fas fa-image"></i> ${p.title}
            </div>
        `;

        return `
            <div class="portfolio-item" data-index="${i}">
                ${imageHtml}
                <div class="card-body">
                    <span class="tag">${p.tag}</span>
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    ${p.result ? `<div class="result">${p.result}</div>` : ''}
                    ${p.url ? `<a href="${p.url}" target="_blank" class="btn-link project-link"><i class="fas fa-external-link-alt"></i> Ver proyecto</a>` : ''}
                </div>
            </div>
        `;
    }).join('');

    const projectCount = document.getElementById('projectCount');
    if (projectCount) projectCount.textContent = `+${projects.length}`;
}

function renderAll() {
    renderTestimonials();
    renderProjects();
}

// ============================================================
// POPUP WHATSAPP
// ============================================================
let isRecording = false;
let recognition = null;
let silenceTimeout = null;
let countdownInterval = null;
let countdownValue = 5;

function initWhatsAppPopup() {
    const popup = document.getElementById('whatsappPopup');
    if (!popup) return;

    const openBtns = document.querySelectorAll('#openPopupBtn, #heroContactBtn, #ctaContactBtn');
    const closeBtn = document.getElementById('closePopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const formContainer = document.getElementById('formContainer');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const popupSubtitle = document.getElementById('popupSubtitle');
    const whatsappForm = document.getElementById('whatsappForm');
    
    // Elementos del formulario
    const waMessage = document.getElementById('waMessage');
    const waName = document.getElementById('waName');
    const waEmail = document.getElementById('waEmail');
    const waPhone = document.getElementById('waPhone');
    const microphoneBtn = document.getElementById('microphoneBtn');
    const microphoneStatus = document.getElementById('microphoneStatus');
    const silenceTimer = document.getElementById('silenceTimer');
    const silenceCountdown = document.getElementById('silenceCountdown');

    function resetMicrophone() {
        if (recognition && isRecording) {
            try { recognition.stop(); } catch(e) {}
            isRecording = false;
        }
        clearTimeout(silenceTimeout);
        clearInterval(countdownInterval);
        if (silenceTimer) silenceTimer.classList.remove('active');
        if (microphoneBtn) {
            microphoneBtn.classList.remove('recording', 'done');
            const icon = microphoneBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-microphone';
        }
        if (waMessage) {
            waMessage.value = '';
            waMessage.disabled = true;
            waMessage.placeholder = 'Presiona el micrófono para dictar...';
        }
        if (microphoneStatus) {
            microphoneStatus.textContent = '⏺️ Presiona el micrófono para dictar';
            microphoneStatus.className = 'microphone-status-text';
        }
    }

    window.openPopupFn = function() {
        if (formContainer) formContainer.style.display = 'block';
        if (thankYouMessage) thankYouMessage.classList.remove('active');
        if (popupSubtitle) popupSubtitle.textContent = 'Completa el formulario y te enviaremos un mensaje con los detalles.';
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetMicrophone();
        loadSavedFormData();
    };

    function closePopupFn() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        if (whatsappForm) whatsappForm.reset();
        if (formContainer) formContainer.style.display = 'block';
        if (thankYouMessage) thankYouMessage.classList.remove('active');
        if (popupSubtitle) popupSubtitle.textContent = 'Completa el formulario y te enviaremos un mensaje con los detalles.';
        resetMicrophone();
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.openPopupFn();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePopupFn);
    if (closePopupBtn) closePopupBtn.addEventListener('click', closePopupFn);
    
    popup.addEventListener('click', function(e) {
        if (e.target === popup) closePopupFn();
    });

    // Manejar envío del formulario
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = waName ? waName.value.trim() : '';
            const email = waEmail ? waEmail.value.trim() : '';
            const phone = waPhone ? waPhone.value.trim() : '';
            const message = waMessage ? waMessage.value.trim() : '';

            saveFormData(name, email, phone);

            const checkboxes = document.querySelectorAll('#whatsappForm .checkbox-group input[type="checkbox"]:checked');
            const services = Array.from(checkboxes).map(cb => cb.value).join(', ') || 'No especificado';

            if (!name || !email || !phone) {
                alert('Por favor completa nombre, email y teléfono.');
                return;
            }

            const whatsappMsg = 
                `Hola, soy ${name}.%0A%0A📧 Email: ${email}%0A📱 Teléfono: ${phone}%0A📋 Servicios de interés: ${services}%0A💬 Mensaje: ${message || 'Sin mensaje adicional.'}`;

            const phoneNumber = '543518692251';
            window.open(`https://wa.me/${phoneNumber}?text=${whatsappMsg}`, '_blank');

            if (formContainer) formContainer.style.display = 'none';
            if (thankYouMessage) thankYouMessage.classList.add('active');
            if (popupSubtitle) popupSubtitle.textContent = '¡Mensaje enviado!';
        });
    }

    // Inicializar reconocimiento de voz
    initSpeechRecognition(waMessage, microphoneBtn, microphoneStatus, silenceTimer, silenceCountdown);
}

// ============================================================
// TRANSCRIPCIÓN DE AUDIO
// ============================================================
function initSpeechRecognition(waMessage, microphoneBtn, microphoneStatus, silenceTimer, silenceCountdown) {
    if (!waMessage || !microphoneBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = function() {
            isRecording = true;
            microphoneBtn.classList.add('recording');
            const icon = microphoneBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-stop';
            if (microphoneStatus) {
                microphoneStatus.textContent = '🎙️ Grabando... Habla ahora';
                microphoneStatus.className = 'microphone-status-text recording';
            }
            waMessage.placeholder = '🎙️ Escuchando...';
            if (silenceTimer) silenceTimer.classList.remove('active');
            clearTimeout(silenceTimeout);
            clearInterval(countdownInterval);
            countdownValue = 5;
        };

        recognition.onresult = function(event) {
            clearTimeout(silenceTimeout);
            clearInterval(countdownInterval);
            if (silenceTimer) silenceTimer.classList.remove('active');
            countdownValue = 5;

            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (interimTranscript) {
                waMessage.placeholder = '🎙️ ' + interimTranscript;
            }

            if (finalTranscript) {
                const currentText = waMessage.value;
                const newText = finalTranscript.charAt(0).toUpperCase() + finalTranscript.slice(1);
                waMessage.value = currentText + (currentText ? ' ' : '') + newText;
            }

            if (waMessage.value.trim() !== '' || interimTranscript) {
                if (silenceTimer) silenceTimer.classList.add('active');
                countdownValue = 5;
                if (silenceCountdown) silenceCountdown.textContent = countdownValue;
                
                countdownInterval = setInterval(() => {
                    countdownValue--;
                    if (silenceCountdown) silenceCountdown.textContent = countdownValue;
                    if (countdownValue <= 0) {
                        clearInterval(countdownInterval);
                        if (isRecording) {
                            try { recognition.stop(); } catch(e) {}
                        }
                    }
                }, 1000);

                silenceTimeout = setTimeout(() => {
                    clearInterval(countdownInterval);
                    if (silenceTimer) silenceTimer.classList.remove('active');
                    if (isRecording) {
                        try { recognition.stop(); } catch(e) {}
                    }
                }, 5000);
            }
        };

        recognition.onend = function() {
            isRecording = false;
            clearTimeout(silenceTimeout);
            clearInterval(countdownInterval);
            if (silenceTimer) silenceTimer.classList.remove('active');
            
            microphoneBtn.classList.remove('recording');
            const icon = microphoneBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-microphone';
            waMessage.placeholder = 'Presiona el micrófono para dictar...';

            if (waMessage.value.trim() !== '') {
                if (microphoneStatus) {
                    microphoneStatus.textContent = '✅ Mensaje transcrito correctamente';
                    microphoneStatus.className = 'microphone-status-text done';
                }
                microphoneBtn.classList.add('done');
                waMessage.disabled = false;
                waMessage.style.cursor = 'default';
            } else {
                if (microphoneStatus) {
                    microphoneStatus.textContent = '⏺️ Presiona el micrófono para dictar';
                    microphoneStatus.className = 'microphone-status-text';
                }
            }
        };

        recognition.onerror = function(event) {
            console.error('Error de reconocimiento:', event.error);
            isRecording = false;
            clearTimeout(silenceTimeout);
            clearInterval(countdownInterval);
            if (silenceTimer) silenceTimer.classList.remove('active');
            
            microphoneBtn.classList.remove('recording');
            const icon = microphoneBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-microphone';
            waMessage.placeholder = 'Presiona el micrófono para dictar...';

            if (microphoneStatus) {
                if (event.error === 'not-allowed') {
                    microphoneStatus.textContent = '❌ Permiso denegado para usar el micrófono';
                    microphoneStatus.className = 'microphone-status-text error';
                } else if (event.error === 'no-speech') {
                    microphoneStatus.textContent = '⏺️ No se detectó voz. Presiona nuevamente';
                    microphoneStatus.className = 'microphone-status-text';
                } else if (event.error === 'audio-capture') {
                    microphoneStatus.textContent = '❌ No se encontró micrófono';
                    microphoneStatus.className = 'microphone-status-text error';
                } else {
                    microphoneStatus.textContent = '⚠️ Error: ' + event.error;
                    microphoneStatus.className = 'microphone-status-text error';
                }
            }
        };

        microphoneBtn.addEventListener('click', function() {
            if (!recognition) return;

            if (isRecording) {
                try { recognition.stop(); } catch(e) {}
                return;
            }

            if (waMessage.value.trim() !== '') {
                if (!confirm('¿Quieres sobrescribir el mensaje actual con uno nuevo?')) {
                    return;
                }
                waMessage.value = '';
                waMessage.disabled = true;
                microphoneBtn.classList.remove('done');
                if (microphoneStatus) {
                    microphoneStatus.textContent = '⏺️ Presiona el micrófono para dictar';
                    microphoneStatus.className = 'microphone-status-text';
                }
            }

            try {
                recognition.start();
            } catch (e) {
                try { recognition.stop(); } catch(ex) {}
                setTimeout(() => {
                    try { recognition.start(); } catch(err) {}
                }, 300);
            }
        });
    } else {
        if (microphoneBtn) microphoneBtn.style.display = 'none';
        if (microphoneStatus) {
            microphoneStatus.textContent = '❌ Tu navegador no soporta dictado por voz';
            microphoneStatus.className = 'microphone-status-text error';
        }
        if (waMessage) {
            waMessage.placeholder = 'Tu navegador no soporta dictado por voz';
            waMessage.disabled = false;
            waMessage.style.cursor = 'text';
        }
        if (silenceTimer) silenceTimer.style.display = 'none';
    }
}

// ============================================================
// INICIALIZAR TODO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Google Analytics con estado de consentimiento
    initGoogleAnalytics();

    // Verificar consentimiento de cookies
    checkCookieConsent();

    // Inicializar menú móvil
    initMobileMenu();

    // Inicializar popups legales
    initLegalPopups();

    // Inicializar popup de WhatsApp
    initWhatsAppPopup();

    // Renderizar contenido
    renderAll();
});