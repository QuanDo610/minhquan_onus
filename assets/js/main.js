document.addEventListener('DOMContentLoaded', function () {

    // Khởi tạo Fancybox
    Fancybox.bind("[data-fancybox]", {
        // Tùy chọn Fancybox (nếu cần)
        Thumbs: {
            showOnStart: false,
        },
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["close"],
            },
        },
    });

    // Xử lý Accordion (Gấp/Mở)
    const taskHeaders = document.querySelectorAll('.task-header');

    taskHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const currentItem = this.closest('.task-item');
            const details = currentItem.querySelector('.task-details');
            const icon = this.querySelector('svg');
            const isOpen = details.classList.contains('open');

            // --- CẬP NHẬT: Đóng tất cả các item khác ---
            document.querySelectorAll('.task-item').forEach(item => {
                if (item !== currentItem) {
                    item.querySelector('.task-details').classList.remove('open');
                    item.querySelector('.task-header').classList.remove('open');
                    item.querySelector('.task-header svg').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle cái hiện tại
            if (!isOpen) {
                details.classList.add('open');
                this.classList.add('open');
                icon.style.transform = 'rotate(180deg)';
            } else {
                details.classList.remove('open');
                this.classList.remove('open');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Xử lý nút "Kiểm tra"
    const checkButtons = document.querySelectorAll('.btn-check');
    checkButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.disabled) return;

            const taskItem = this.closest('.task-item');
            if (!taskItem) return;

            const input = taskItem.querySelector('.onus-id-input');
            const onusID = input ? input.value.trim() : null;
            const taskName = taskItem.getAttribute('data-task-name');

            // Xóa style lỗi cũ (nếu có)
            input.classList.remove('invalid');

            // --- CẬP NHẬT: Logic Validation ---
            if (!onusID) {
                alert('Vui lòng nhập ID ONUS của bạn để kiểm tra.');
                input.classList.add('invalid');
                input.focus();
                return;
            }

            if (!/^\d+$/.test(onusID)) {
                alert('ID ONUS không hợp lệ, vui lòng chỉ nhập dãy số.');
                input.classList.add('invalid');
                input.focus();
                return;
            }

            if (onusID.length < 15) {
                alert('ID ONUS có vẻ quá ngắn. Vui lòng kiểm tra lại (ID thường có 19 chữ số).');
                input.classList.add('invalid');
                input.focus();
                return;
            }

            // Vô hiệu hóa nút và input
            this.disabled = true;
            this.textContent = 'Đang gửi...';
            input.disabled = true;
            taskItem.classList.add('opacity-75');

            console.log(`Gửi yêu cầu: Task = ${taskName}, ONUS ID = ${onusID}`);

            // GHI CHÚ: Đây là nơi chúng ta sẽ gọi API (ở bước sau)
            // Ví dụ: sendDataToTelegram(taskName, onusID);

            // Giả lập:
            setTimeout(() => {
                this.textContent = 'Đã gửi, chờ duyệt';
            }, 1000);
        });
    });

    // Reset style lỗi khi người dùng nhập lại
    document.querySelectorAll('.onus-id-input').forEach(input => {
        input.addEventListener('input', function () {
            if (this.classList.contains('invalid')) {
                this.classList.remove('invalid');
            }
        });
    });


    // Xử lý nút "Copy"
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();

            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Đã copy!';
                this.classList.add('copied');

                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Không thể copy: ', err);
            });
        });
    });

});