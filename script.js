/* ============================================
   PEMBELAJARAN GOLONGAN DARAH - JAVASCRIPT
   Website Interaktif untuk Belajar Genetika
   ============================================ */

// ============================================
// NAVIGATION & SCROLL FUNCTIONALITY
// ============================================

// Smooth scroll untuk semua link navigasi
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling untuk link anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize quiz
    initQuiz();
});

// Update active navigation link berdasarkan scroll position
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    const scrollBtn = document.getElementById('scrollToTop');
    if (currentScroll > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SIMULASI PEWARISAN GOLONGAN DARAH
// ============================================

// Data kemungkinan pewarisan berdasarkan kombinasi orang tua
const inheritanceData = {
    'A-A': { A: 75, O: 25, B: 0, AB: 0 },
    'A-B': { A: 25, B: 25, AB: 25, O: 25 },
    'A-AB': { A: 50, B: 25, AB: 25, O: 0 },
    'A-O': { A: 50, O: 50, B: 0, AB: 0 },
    'B-B': { B: 75, O: 25, A: 0, AB: 0 },
    'B-AB': { A: 25, B: 50, AB: 25, O: 0 },
    'B-O': { B: 50, O: 50, A: 0, AB: 0 },
    'AB-AB': { A: 25, B: 25, AB: 50, O: 0 },
    'AB-O': { A: 50, B: 50, AB: 0, O: 0 },
    'O-O': { O: 100, A: 0, B: 0, AB: 0 }
};

// Fungsi untuk mendapatkan key yang sudah diurutkan
function getSortedKey(blood1, blood2) {
    const bloods = [blood1, blood2].sort();
    return bloods.join('-');
}

// Fungsi utama untuk menghitung pewarisan
function calculateInheritance() {
    // Ambil input dari form
    const fatherBlood = document.getElementById('fatherBlood').value;
    const fatherRh = document.getElementById('fatherRh').value;
    const motherBlood = document.getElementById('motherBlood').value;
    const motherRh = document.getElementById('motherRh').value;

    // Validasi input
    if (!fatherBlood || !fatherRh || !motherBlood || !motherRh) {
        alert('Mohon lengkapi semua pilihan golongan darah!');
        return;
    }

    // Hitung hasil pewarisan ABO
    const key = getSortedKey(fatherBlood, motherBlood);
    const aboResults = inheritanceData[key];

    // Hitung hasil pewarisan Rhesus
    const rhResults = calculateRhesus(fatherRh, motherRh);

    // Tampilkan hasil
    displayResults(aboResults, rhResults);
}

// Fungsi untuk menghitung pewarisan Rhesus
function calculateRhesus(fatherRh, motherRh) {
    if (fatherRh === 'positive' && motherRh === 'positive') {
        return { positive: 93.75, negative: 6.25 }; // Asumsi heterozigot
    } else if (fatherRh === 'positive' && motherRh === 'negative') {
        return { positive: 50, negative: 50 };
    } else if (fatherRh === 'negative' && motherRh === 'positive') {
        return { positive: 50, negative: 50 };
    } else {
        return { positive: 0, negative: 100 };
    }
}

// Fungsi untuk menampilkan hasil simulasi
function displayResults(aboResults, rhResults) {
    const resultsDiv = document.getElementById('simulatorResults');
    const resultsContent = document.getElementById('resultsContent');

    // Generate HTML untuk hasil ABO
    let aboHTML = '<div class="result-section"><h4>🩸 Kemungkinan Golongan Darah (ABO)</h4><div class="result-cards">';
    
    const bloodColors = {
        A: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        B: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        AB: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        O: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };

    for (const [blood, percentage] of Object.entries(aboResults)) {
        if (percentage > 0) {
            aboHTML += `
                <div class="result-item">
                    <div class="result-icon" style="background: ${bloodColors[blood]};">
                        ${blood}
                    </div>
                    <div class="result-content">
                        <h4>Golongan ${blood}</h4>
                        <div class="result-percentage">${percentage}%</div>
                    </div>
                </div>
            `;
        }
    }
    aboHTML += '</div></div>';

    // Generate HTML untuk hasil Rhesus
    let rhHTML = '<div class="result-section" style="margin-top: 2rem;"><h4>🧬 Kemungkinan Rhesus</h4><div class="result-cards">';
    
    for (const [rh, percentage] of Object.entries(rhResults)) {
        if (percentage > 0) {
            const rhColor = rh === 'positive' ? 
                'linear-gradient(135deg, #51cf66 0%, #37b24d 100%)' : 
                'linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%)';
            const rhLabel = rh === 'positive' ? 'Rh+' : 'Rh-';
            
            rhHTML += `
                <div class="result-item">
                    <div class="result-icon" style="background: ${rhColor};">
                        ${rhLabel}
                    </div>
                    <div class="result-content">
                        <h4>Rhesus ${rh === 'positive' ? 'Positif' : 'Negatif'}</h4>
                        <div class="result-percentage">${percentage}%</div>
                    </div>
                </div>
            `;
        }
    }
    rhHTML += '</div></div>';

    // Tambahkan penjelasan
    const explanationHTML = `
        <div class="result-section" style="margin-top: 2rem;">
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 1rem; border-left: 4px solid #4dabf7;">
                <h4 style="margin-bottom: 1rem;">📖 Penjelasan</h4>
                <p style="color: #495057; line-height: 1.8;">
                    Hasil di atas menunjukkan kemungkinan golongan darah anak berdasarkan kombinasi 
                    golongan darah orang tua. Persentase menunjukkan probabilitas masing-masing kemungkinan. 
                    Dalam kenyataannya, setiap kehamilan adalah peristiwa independen dengan probabilitas yang sama.
                </p>
            </div>
        </div>
    `;

    // Tampilkan semua hasil
    resultsContent.innerHTML = aboHTML + rhHTML + explanationHTML;
    resultsDiv.style.display = 'block';

    // Smooth scroll ke hasil
    setTimeout(() => {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// ============================================
// KUIS INTERAKTIF
// ============================================

// Data soal kuis
const quizQuestions = [
    {
        question: "Golongan darah apa yang tidak memiliki antigen pada permukaan sel darah merah?",
        options: ["Golongan A", "Golongan B", "Golongan AB", "Golongan O"],
        correct: 3,
        explanation: "Golongan O tidak memiliki antigen A maupun B pada permukaan sel darah merah. Inilah yang membuat golongan O dapat menjadi donor universal."
    },
    {
        question: "Genotipe untuk golongan darah AB adalah:",
        options: ["I<sup>A</sup>I<sup>A</sup>", "I<sup>B</sup>I<sup>B</sup>", "I<sup>A</sup>I<sup>B</sup>", "ii"],
        correct: 2,
        explanation: "Golongan darah AB memiliki genotipe I<sup>A</sup>I<sup>B</sup>, menunjukkan kodominansi di mana kedua alel terekspresikan."
    },
    {
        question: "Jika ayah bergolongan darah A (I<sup>A</sup>i) dan ibu bergolongan darah B (I<sup>B</sup>i), kemungkinan golongan darah anak mereka adalah:",
        options: ["Hanya A dan B", "A, B, AB, dan O", "Hanya AB", "Hanya O"],
        correct: 1,
        explanation: "Dari persilangan heterozigot A dan B, semua kemungkinan golongan darah bisa muncul: A (25%), B (25%), AB (25%), dan O (25%)."
    },
    {
        question: "Antibodi apa yang dimiliki oleh seseorang dengan golongan darah A?",
        options: ["Anti-A", "Anti-B", "Anti-A dan Anti-B", "Tidak ada antibodi"],
        correct: 1,
        explanation: "Golongan darah A memiliki antibodi Anti-B dalam plasma darahnya, yang akan melawan sel darah merah yang mengandung antigen B."
    },
    {
        question: "Rhesus positif (Rh+) bersifat:",
        options: ["Resesif terhadap Rh-", "Dominan terhadap Rh-", "Kodominan dengan Rh-", "Tidak terkait dengan Rh-"],
        correct: 1,
        explanation: "Alel Rhesus positif (D) bersifat dominan terhadap Rhesus negatif (d). Sehingga genotipe DD dan Dd keduanya menghasilkan fenotipe Rh+."
    },
    {
        question: "Seseorang dengan golongan darah O memiliki genotipe:",
        options: ["I<sup>A</sup>I<sup>A</sup>", "I<sup>B</sup>I<sup>B</sup>", "I<sup>A</sup>I<sup>B</sup>", "ii"],
        correct: 3,
        explanation: "Golongan darah O memiliki genotipe ii (homozigot resesif), sehingga tidak mengekspresikan antigen A maupun B."
    },
    {
        question: "Jika kedua orang tua bergolongan darah AB, kemungkinan mereka memiliki anak bergolongan darah O adalah:",
        options: ["25%", "50%", "75%", "0% (tidak mungkin)"],
        correct: 3,
        explanation: "Orang tua dengan golongan darah AB (I<sup>A</sup>I<sup>B</sup>) tidak memiliki alel i, sehingga tidak mungkin menghasilkan anak dengan golongan darah O (ii)."
    },
    {
        question: "Golongan darah yang disebut 'donor universal' adalah:",
        options: ["A", "B", "AB", "O"],
        correct: 3,
        explanation: "Golongan darah O negatif disebut donor universal karena tidak memiliki antigen A, B, atau Rh yang dapat memicu reaksi pada resipien."
    },
    {
        question: "Jika ayah Rh+ (Dd) dan ibu Rh- (dd), kemungkinan anak mereka Rh+ adalah:",
        options: ["0%", "25%", "50%", "100%"],
        correct: 2,
        explanation: "Dari persilangan Dd × dd, kemungkinan genotipe anak adalah Dd (Rh+) sebesar 50% dan dd (Rh-) sebesar 50%."
    },
    {
        question: "Peristiwa dimana kedua alel terekspresikan secara bersamaan disebut:",
        options: ["Dominansi penuh", "Resesif", "Kodominansi", "Dominansi tidak lengkap"],
        correct: 2,
        explanation: "Kodominansi terjadi ketika kedua alel terekspresikan bersamaan, seperti pada golongan darah AB di mana antigen A dan B sama-sama muncul."
    }
];

// Variabel untuk menyimpan state kuis
let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;

// Inisialisasi kuis
function initQuiz() {
    displayQuestion();
}

// Menampilkan pertanyaan
function displayQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        return;
    }

    const question = quizQuestions[currentQuestion];
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');
    const questionNumber = document.getElementById('questionNumber');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Update nomor pertanyaan
    questionNumber.textContent = `Pertanyaan ${currentQuestion + 1}`;

    // Tampilkan pertanyaan
    questionText.innerHTML = question.question;

    // Generate opsi jawaban
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        const isSelected = userAnswers[currentQuestion] === index;
        optionsHTML += `
            <button class="option-btn ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${index})">
                ${String.fromCharCode(65 + index)}. ${option}
            </button>
        `;
    });
    quizOptions.innerHTML = optionsHTML;

    // Update tombol navigasi
    prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    
    if (currentQuestion === quizQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }

    // Sembunyikan penjelasan
    document.getElementById('quizExplanation').style.display = 'none';
}

// Memilih jawaban
function selectAnswer(answerIndex) {
    userAnswers[currentQuestion] = answerIndex;
    
    // Update tampilan opsi
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
    });
}

// Navigasi ke pertanyaan berikutnya
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

// Navigasi ke pertanyaan sebelumnya
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// Submit kuis dan tampilkan hasil
function submitQuiz() {
    // Hitung skor
    let correctAnswers = 0;
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correctAnswers++;
        }
    });

    // Tentukan pesan berdasarkan skor
    let message = '';
    let icon = '';
    if (correctAnswers === quizQuestions.length) {
        message = 'Sempurna! Anda menguasai materi dengan sangat baik! 🎉';
        icon = '🏆';
    } else if (correctAnswers >= quizQuestions.length * 0.8) {
        message = 'Hebat! Pemahaman Anda sangat baik!';
        icon = '⭐';
    } else if (correctAnswers >= quizQuestions.length * 0.6) {
        message = 'Bagus! Terus tingkatkan pemahaman Anda!';
        icon = '👍';
    } else {
        message = 'Jangan menyerah! Pelajari kembali materinya dan coba lagi!';
        icon = '💪';
    }

    // Generate breakdown hasil
    let breakdownHTML = '';
    quizQuestions.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correct;
        const userAnswer = userAnswers[index] !== undefined ? 
            String.fromCharCode(65 + userAnswers[index]) : '-';
        const correctAnswer = String.fromCharCode(65 + question.correct);
        
        breakdownHTML += `
            <div class="breakdown-item ${isCorrect ? 'correct' : 'incorrect'}">
                <span>Soal ${index + 1}</span>
                <span>${isCorrect ? '✓' : '✗'} Jawaban Anda: ${userAnswer} | Benar: ${correctAnswer}</span>
            </div>
        `;
    });

    // Tampilkan hasil
    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = message;
    document.getElementById('finalScore').textContent = correctAnswers;
    document.getElementById('resultsMessage').textContent = 
        `Anda menjawab ${correctAnswers} dari ${quizQuestions.length} pertanyaan dengan benar.`;
    document.getElementById('resultsBreakdown').innerHTML = breakdownHTML;

    // Sembunyikan card kuis dan tampilkan hasil
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';

    // Scroll ke hasil
    document.getElementById('quizResults').scrollIntoView({ behavior: 'smooth' });
}

// Restart kuis
function restartQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizStarted = false;

    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    
    displayQuestion();
}

// ============================================
// FORM KONTAK
// ============================================

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Ambil nilai form
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Reset error messages
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';

    // Validasi
    let isValid = true;

    if (name.length < 3) {
        document.getElementById('nameError').textContent = 'Nama harus minimal 3 karakter';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Format email tidak valid';
        isValid = false;
    }

    if (message.length < 10) {
        document.getElementById('messageError').textContent = 'Pesan harus minimal 10 karakter';
        isValid = false;
    }

    // Jika valid, tampilkan pesan sukses
    if (isValid) {
        document.getElementById('formSuccess').style.display = 'block';
        
        // Reset form setelah 3 detik
        setTimeout(() => {
            this.reset();
            document.getElementById('formSuccess').style.display = 'none';
        }, 3000);

        // Dalam implementasi nyata, kirim data ke server
        console.log('Form submitted:', { name, email, message });
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Fungsi untuk format angka dengan pemisah ribuan
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk mengacak array (untuk variasi soal kuis)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Log untuk debugging (bisa dihapus di production)
console.log('🧬 Pembelajaran Golongan Darah loaded successfully!');
console.log('📚 Website siap digunakan untuk belajar genetika');

// ============================================
// EXPORT (jika diperlukan untuk module)
// ============================================

// Jika menggunakan ES6 modules
// export { calculateInheritance, initQuiz, scrollToTop };