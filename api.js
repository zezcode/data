// Hàm để thực hiện khi thời gian kết thúc
function onTimeout() {
    console.log("Thời gian đã kết thúc!");
    // Đoạn code bạn muốn thực hiện khi thời gian kết thúc ở đây
}

// Thiết lập thời gian chờ 100 giây
const timeInMilliseconds = 100000; // 100 giây = 100,000 miligiây
const timer = setTimeout(onTimeout, timeInMilliseconds);

// Nếu bạn muốn dừng thời gian trước khi nó kết thúc
// clearTimeout(timer);
