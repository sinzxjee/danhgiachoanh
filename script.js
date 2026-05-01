const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlcWb7LonMbd0hjqVVNZKbdXgKrMUBQczFeDexZQDjPWDCBrkDYA7JhhbM7xjlyf5EIA/exec";

document.addEventListener('DOMContentLoaded', () => {
    let rating = 0;
    const mascot = document.getElementById('cat-mascot');
    const bubble = document.getElementById('chat-bubble');
    const follower = document.getElementById('cursor-follower');
    const thanksPopup = document.getElementById('thanks-popup');
    const closePopup = document.getElementById('close-popup');

    // 1. Mèo chạy theo chuột (Thay ảnh GIF)
    // Bạn có thể thay link GIF ở đây
    if (follower) {
        follower.innerHTML = `<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bm9ueXpueHByZzJueGZ3bm9ueXpueHByZzJueGZ3bm9ueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oriO0OEd9QIDdllqo/giphy.gif" style="width:50px; height:50px; object-fit:contain;">`;
        
        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX - 25 + 'px';
            follower.style.top = e.clientY - 25 + 'px';
        });
    }

    // 2. Chấm sao & Đổi Mascot theo mức độ cảm xúc
    const stars = document.querySelectorAll('.stars span');
    
    const catEmotions = {
        1: {
            img: "https://cataas.com/cat/angry",
            msg: "Tệ quá không zay 😿",
            color: "#ff4d4d"
        },
        2: {
            img: "https://cataas.com/cat/sad",
            msg: "Cố gắng lên 1 xíu nữa xemm 😿",
            color: "#ff944d"
        },
        3: {
            img: "https://cataas.com/cat/cute",
            msg: "Chắc là cũng ổn thui 😸",
            color: "#ffd11a"
        },
        4: {
            img: "https://cataas.com/cat/says/Great",
            msg: "Thật sự đỉnh 😻",
            color: "#54a0ff"
        },
        5: {
            img: "https://cataas.com/cat/says/Perfect",
            msg: "Quá là tuyệt với lun ròii 👑",
            color: "#ff80ab"
        }
    };

    stars.forEach(s => {
        s.addEventListener('click', () => {
            rating = parseInt(s.dataset.v);
            
            // Active sao
            stars.forEach(star => star.classList.toggle('active', star.dataset.v <= rating));
            
            const emotion = catEmotions[rating];

            // Cập nhật Mascot
            mascot.src = `${emotion.img}?t=${Date.now()}`;
            
            // Cập nhật lời thoại và style
            bubble.innerText = emotion.msg;
            bubble.style.borderColor = emotion.color;
            bubble.style.boxShadow = `6px 6px 0px ${emotion.color}`;
            
            // Hiệu ứng phản hồi
            mascot.style.transform = `scale(${1 + rating * 0.03}) rotate(${rating % 2 === 0 ? 5 : -5}deg)`;
            mascot.style.borderColor = emotion.color;
            
            setTimeout(() => {
                mascot.style.transform = `scale(${1 + rating * 0.03}) rotate(0deg)`;
            }, 200);
        });
    });

    // 3. Ghi nhớ cảm xúc khi gõ (Tính năng tò mò)
    const commentInput = document.getElementById('comment');
    if (commentInput) {
        commentInput.addEventListener('input', () => {
            if (rating > 0) {
                mascot.style.transform = `scale(${1.1 + rating * 0.03}) rotate(5deg)`;
            }
        });
        commentInput.addEventListener('blur', () => {
            mascot.style.transform = `scale(${1 + rating * 0.03})`;
        });
    }

    // 4. Gửi dữ liệu & Hiện Pop-up
    document.getElementById('send-btn').addEventListener('click', async function() {
        const service = document.getElementById('service').value;
        const comment = document.getElementById('comment').value;

        if(!service || !comment || rating === 0) {
            alert("Điền đủ thông tin và chấm sao đã bạn ơii! 🐾");
            return;
        }

        this.disabled = true;
        const originalText = this.innerText;
        this.innerText = "Đang gửi, đợi xíuuu... 🐾";

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service, stars: rating, comment })
            });

            // Hiệu ứng mưa mèo ăn mừng
            makeItRain();

            // HIỆN POP-UP THAY VÌ ALERT
            if (thanksPopup) {
                thanksPopup.style.display = 'flex';
            }

            // Reset form
            document.getElementById('service').value = '';
            document.getElementById('comment').value = '';
            rating = 0;
            stars.forEach(star => star.classList.remove('active'));
            bubble.innerText = "Đánh giá cho anh nhé!!";
            bubble.style.borderColor = "#ffcccc";
            bubble.style.boxShadow = "6px 6px 0px #ffcccc";
            mascot.src = "https://cataas.com/cat/says/Hello";
            mascot.style.transform = "scale(1)";

        } catch (e) {
            console.error(e);
            alert("Có lỗi rồi, kiểm tra lại URL Script nha!");
        } finally {
            this.disabled = false;
            this.innerText = originalText;
        }
    });

    // Đóng Pop-up
    if (closePopup) {
        closePopup.addEventListener('click', () => {
            thanksPopup.style.display = 'none';
        });
    }

    // Đóng khi click ra ngoài Pop-up
    window.addEventListener('click', (e) => {
        if (e.target === thanksPopup) {
            thanksPopup.style.display = 'none';
        }
    });

    // 5. Hiệu ứng dấu chân khi click
    document.addEventListener('click', (e) => {
        // Không tạo dấu chân nếu click vào nút hoặc input
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const paw = document.createElement('div');
        paw.className = 'paw-print';
        paw.innerText = '🐾';
        paw.style.left = (e.pageX - 15) + 'px';
        paw.style.top = (e.pageY - 15) + 'px';
        paw.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(paw);
        setTimeout(() => paw.remove(), 1000);
    });

    function makeItRain() {
        const icons = ['🐱', '🐈', '🐾', '🐟', '👑', '❤️'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const drop = document.createElement('div');
                drop.className = 'cat-drop';
                drop.innerText = icons[Math.floor(Math.random() * icons.length)];
                drop.style.left = Math.random() * 90 + 'vw'; // Giới hạn 90vw để không tràn mobile
                drop.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
                document.body.appendChild(drop);
                setTimeout(() => drop.remove(), 2500);
            }, i * 80);
        }
    }
});