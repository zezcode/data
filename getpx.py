import os
import requests

def proxy():
    urls = [
    "https://openproxylist.xyz/http.txt",    
    "http://alexa.lr2b.com/proxylist.txt",
    "https://multiproxy.org/txt_all/proxy.txt",      
    "https://api.proxyscrape.com/?request=getproxies&proxytype=https&timeout=1000&country=all&ssl=all&anonymity=all",
    "https://api.proxyscrape.com/v2/?request=getproxies&protocol=https&timeout=10000&country=all&ssl=all&anonymity=all&simplified=true",
    "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=all&anonymity=all",
    "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all&simplified=true",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
    "https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt",
    "https://raw.githubusercontent.com/monosans/proxy-li/st/main/proxies/http.txt",
    ]
    proxies = set()
    print("Đang lấy Proxy, vui lòng đợi!")
    if os.path.exists("proxy.txt"):
        os.remove("proxy.txt")

    with open('proxy.txt', 'w') as f:
        for url in urls:
            response = requests.get(url)
            f.write(response.text)
            proxies.update(response.text.splitlines())

        # Sử dụng list comprehension để lọc và ghi lại chỉ các proxy hợp lệ
        valid_proxies = [proxy for proxy in proxies if ":" in proxy]
        f.writelines('\n'.join(valid_proxies))

    # Đọc lại tệp và loại bỏ các dòng trống
    with open('proxy.txt', 'r') as f:
        lines = f.readlines()
        non_empty_lines = [line.strip() for line in lines if line.strip()]

    # Ghi lại tệp với các dòng không trống
    with open('proxy.txt', 'w') as f:
        f.writelines('\n'.join(non_empty_lines))

    proxy_count = len(non_empty_lines)
    print("Proxy được làm mới thành công!")
    print("Số lượng proxy:", proxy_count)  
    input("Gõ Enter để thoát...")
proxy()
