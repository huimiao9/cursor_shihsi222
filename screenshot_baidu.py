#!/usr/bin/env python3
"""
百度截图脚本
使用 Selenium 或 Playwright 打开 baidu.com 并截图

运行方式:
1. 安装依赖: pip install selenium webdriver-manager
   或者: pip install playwright && playwright install chromium
2. 运行脚本: python3 screenshot_baidu.py
"""

import os
import sys
from datetime import datetime

def screenshot_with_selenium():
    """使用 Selenium 截图"""
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.service import Service
        from selenium.webdriver.chrome.options import Options
        from webdriver_manager.chrome import ChromeDriverManager

        print("正在使用 Selenium 截图...")

        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--lang=zh-CN')

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        driver.get('https://www.baidu.com')

        # 等待页面加载
        import time
        time.sleep(2)

        # 生成文件名
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'baidu_screenshot_{timestamp}.png'

        driver.save_screenshot(filename)
        driver.quit()

        print(f"截图已保存: {os.path.abspath(filename)}")
        return filename

    except ImportError:
        print("Selenium 未安装，请运行: pip install selenium webdriver-manager")
        return None
    except Exception as e:
        print(f"Selenium 截图失败: {e}")
        return None

def screenshot_with_playwright():
    """使用 Playwright 截图"""
    try:
        from playwright.sync_api import sync_playwright

        print("正在使用 Playwright 截图...")

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={'width': 1920, 'height': 1080})

            page.goto('https://www.baidu.com')
            page.wait_for_load_state('networkidle')

            # 生成文件名
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'baidu_screenshot_{timestamp}.png'

            page.screenshot(path=filename, full_page=False)
            browser.close()

            print(f"截图已保存: {os.path.abspath(filename)}")
            return filename

    except ImportError:
        print("Playwright 未安装，请运行: pip install playwright && playwright install chromium")
        return None
    except Exception as e:
        print(f"Playwright 截图失败: {e}")
        return None

def main():
    print("=" * 50)
    print("百度截图工具")
    print("=" * 50)

    # 尝试使用 Playwright
    result = screenshot_with_playwright()

    # 如果 Playwright 失败，尝试 Selenium
    if result is None:
        result = screenshot_with_selenium()

    if result is None:
        print("\n截图失败！请确保已安装以下工具之一:")
        print("1. Playwright: pip install playwright && playwright install chromium")
        print("2. Selenium: pip install selenium webdriver-manager")
        sys.exit(1)
    else:
        print("\n截图完成！")

if __name__ == '__main__':
    main()
