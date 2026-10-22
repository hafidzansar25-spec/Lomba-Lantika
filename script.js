// assets/js/app.js

// State global untuk menyimpan semua data
window.allGigs = [];
let activeCategory = 'Semua';

// --- 1. MOCK DATA (Sementara, hapus jika API Backend sudah siap) ---
const mockGigs = [
    { id: 1, title: "Desain Logo Minimalis", category: "Design", freelancer_name: "Budi Santoso", school: "SMK Telkom", price: 150000, whatsapp: "081234567890", description: "Jasa pembuatan logo minimalis modern, termasuk 2x revisi dan file mentah.", image_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500&q=80" },
    { id: 2, title: "Edit Video TikTok/Reels Viral", category: "Video", freelancer_name: "Siti Aminah", school: "Universitas Indonesia", price: 75000, whatsapp: "628987654321", description: "Editing video pendek durasi 15-60 detik, sound effect, dan text animation.", image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=500&q=80" },
    { id: 3, title: "Landing Page HTML/CSS", category: "Code", freelancer_name: "Andi Wijaya", school: "Institut Teknologi Bandung", price: 300000, whatsapp: "081112223334", description: "Pembuatan landing page responsif menggunakan HTML, CSS (Tailwind), dan JS dasar.", image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80" },
    { id: 4, title: "Penulisan Artikel SEO", category: "Writing", freelancer_name: "Rina Melati", school: "Universitas Padjadjaran", price: 50000, whatsapp: "085566778899", description: "Artikel 500-700 kata, riset keyword, dan bebas plagiasi.", image_url: "https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&w=500&q=80" }
];

// --- 2. FUNGSI FETCH DATA ---
async function fetchGigs() {
    try {
        // JIKA BACKEND SUDAH SIAP, HAPUS BARIS MOCK DAN UNCOMMENT BARIS FETCH DI BAWAH INI:
        
        /* 
        const response = await fetch('http://localhost:5000/api/gigs');
        const data = await response.json();
        window.allGigs = data;
        */

        // Menggunakan Mock Data untuk sementara:
        window.allGigs = mockGigs;
        
        // Render data awal
        renderGigs(window.allGigs);
        
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        document.getElementById('gigs-container').innerHTML = `<p class="text-center text-red-500 w-full col-span-full">Gagal memuat data. Pastikan server backend menyala.</p>`;
    }
}

// --- 3. FUNGSI RENDER KARTU ---
function renderGigs(dataList) {
    const container = document.getElementById('gigs-container');
    
    // Kosongkan container
    container.innerHTML = '';

    // Jika data kosong
    if (dataList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <i class="fa-solid fa-magnifying-glass text-6xl mb-4 text-gray-300"></i>
                <h3 class="text-xl font-semibold text-dark">Jasa tidak ditemukan</h3>
                <p class="text-sm mt-1">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
        `;
        return;
    }

    // Loop data dan render HTML
    dataList.forEach(gig => {
        // Fallback image jika tidak ada URL
        const imageSrc = gig.image_url ? gig.image_url : 'https://via.placeholder.com/500x300?text=No+Image';
        
        // Format harga ke Rupiah
        const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(gig.price);

        const cardHTML = `
            <div class="gig-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div class="relative h-48 bg-gray-200 overflow-hidden">
                    <img src="${imageSrc}" alt="${gig.title}" class="w-full h-full object-cover">
                    <span class="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">${gig.category}</span>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="font-bold text-lg mb-1 line-clamp-2">${gig.title}</h3>
                    <p class="text-sm text-gray-500 mb-1"><i class="fa-solid fa-user text-primary mr-1"></i> ${gig.freelancer_name}</p>
                    <p class="text-xs text-gray-400 mb-4"><i class="fa-solid fa-graduation-cap mr-1"></i> ${gig.school}</p>
                    
                    <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span class="font-bold text-primary text-lg">${formattedPrice}</span>
                        <!-- Tombol Detail memanggil openModal dengan ID -->
                        <button onclick="openModal(${gig.id})" class="text-sm font-semibold bg-indigo-50 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg transition-colors">
                            Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// --- 4. FUNGSI PENCARIAN & FILTER ---
function setupSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Fungsi helper untuk menjalankan filter
    const applyFilter = () => {
        const keyword = searchInput.value.toLowerCase();
        
        const filteredResult = window.allGigs.filter(gig => {
            const matchKeyword = gig.title.toLowerCase().includes(keyword) || gig.freelancer_name.toLowerCase().includes(keyword);
            const matchCategory = activeCategory === 'Semua' || gig.category === activeCategory;
            return matchKeyword && matchCategory;
        });

        renderGigs(filteredResult);
    };

    // Event Listener untuk Input Pencarian
    searchInput.addEventListener('input', applyFilter);

    // Event Listener untuk Tombol Kategori
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Reset style semua tombol
            filterBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
            });

            // Ubah style tombol yang diklik
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
            clickedBtn.classList.add('bg-primary', 'text-white');

            // Set kategori aktif dan jalankan filter
            activeCategory = clickedBtn.dataset.category;
            applyFilter();
        });
    });
}

// --- 5. FUNGSI BUKA MODAL (POP-UP) ---
function openModal(gigId) {
    const gig = window.allGigs.find(g => g.id === gigId);
    if (!gig) return;

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    // Format nomor WA (Pastikan berawalan 62)
    let waNumber = gig.whatsapp;
    if (waNumber.startsWith('08')) {
        waNumber = '62' + waNumber.slice(1);
    }

    // Teks default untuk WA
    const waText = encodeURIComponent(`Halo ${gig.freelancer_name}, saya tertarik dengan jasa Anda: "${gig.title}" di HustleYouth. Apakah masih tersedia?`);
    const waLink = `https://wa.me/${waNumber}?text=${waText}`;

    // Format Harga
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(gig.price);
    const imageSrc = gig.image_url ? gig.image_url : 'https://via.placeholder.com/800x400?text=No+Image';

    // Isi konten modal
    modalContent.innerHTML = `
        <div class="relative">
            <img src="${imageSrc}" alt="${gig.title}" class="w-full h-64 object-cover">
            <button onclick="closeModal()" class="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-colors shadow-sm">
                <i class="fa-solid fa-times"></i>
            </button>
            <span class="absolute bottom-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">${gig.category}</span>
        </div>
        <div class="p-6 md:p-8">
            <h2 class="text-2xl font-bold mb-2">${gig.title}</h2>
            <div class="flex items-center gap-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-4">
                <p><i class="fa-solid fa-user text-primary mr-1"></i> ${gig.freelancer_name}</p>
                <p><i class="fa-solid fa-graduation-cap text-primary mr-1"></i> ${gig.school}</p>
            </div>
            
            <div class="mb-6">
                <h4 class="font-semibold text-dark mb-2">Deskripsi Jasa:</h4>
                <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">${gig.description}</p>
            </div>

            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div>
                    <p class="text-xs text-gray-500 mb-1">Harga Mulai</p>
                    <span class="text-2xl font-bold text-primary">${formattedPrice}</span>
                </div>
                <!-- ID a#order-wa-btn WAJIB ADA SESUAI PRD -->
                <a href="${waLink}" target="_blank" id="order-wa-btn" class="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-200 transition-colors flex items-center gap-2">
                    <i class="fa-brands fa-whatsapp text-xl"></i> Order via WA
                </a>
            </div>
        </div>
    `;

    // Tampilkan modal (hapus class hidden)
    modalOverlay.classList.remove('hidden');
    // Mencegah background ikut ter-scroll
    document.body.style.overflow = 'hidden'; 
}

// Fungsi Tambahan untuk Menutup Modal
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Kembalikan scroll
}

// Event listener untuk menutup modal jika area gelap (overlay) diklik
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// --- 6. INISIALISASI SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', () => {
    fetchGigs();
    setupSearchAndFilter();
});
