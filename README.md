# Yuan-Tuan-Wei-Yu
透過手機 Web app 遠端監控魚缸，監測水質，餵魚。  
簡報: https://docs.google.com/presentation/d/1XILiHoCh-3hCT4_O94E6LjNnAZBM8lx6Rv6cTUsI5Ck/edit#slide=id.p  
  
[TOC]  

## 用戶端介面示意圖
![](https://i.imgur.com/AL9SwlC.png)  

![](https://i.imgur.com/ZuNiLnJ.png)  

## 系統架構
![](https://i.imgur.com/OFyiS7l.png)  

### Server side
Node.js
- [express](http://expressjs.com/)
- [Socket.io](https://socket.io/)
- [onoff](https://github.com/fivdi/onoff)
- [child_process.spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
- [ds18b20](https://github.com/chamerling/ds18b20)  

### Client side
Web app
- [jQuery](https://jquery.com/)
- [Bootstrap 4 beta 3](https://getbootstrap.com/)
- [Socket.io](https://socket.io/)  

## 設備
| 名稱 | 數量 | 來源 |
| --- | --- | ---- |
| IC 自動控溫器 | 1 | NTD 500 (水族館) |
| LED | 1 | MOLi |
| 電阻 | 2 | MOLi |
| 繼電器 | 2 | MOLi |
| ds18b20 | 1 | RMB 10 (淘寶) |
| PH-Sensor-E-201-C | 1 | RMB 152 (淘寶) |
| TDS sensor | 1 | RMB 55 (淘寶) |
| ES08A II | 1 | MOLi |
| Logitech C910 | 1 | MOLi 善心人士 |
| 麵包板 | 2 | MOLi |  

### 1. LED
用來照亮魚缸，方便透過鏡頭觀看魚隻狀況。  

**實圖**
![](https://i.imgur.com/wdvlFUc.jpg)  

![](https://i.imgur.com/q6CuX1v.jpg)  

**接法**
透過繼電器控制 LED 開關，GPIO 16，繼電器常關。
```python
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(16, GPIO.OUT)
GPIO.output(16, GPIO.HIGH)
```  

### 2. 水溫感測
感測魚缸水溫並即時顯示於用戶端。  

**實圖**
![](https://i.imgur.com/LGaoSs3.jpg)  

**感測器: ds18b20**
**接法**
![](https://i.imgur.com/OFgqecu.png)  

使用 node module ds18b20  
https://github.com/chamerling/ds18b20  
```javascript
const ds18b20 = require('ds18b20');
ds18b20.sensors(function (err, ids) {
    const temp = ds18b20.temperatureSync(ids[0]);
});
```  

### 3. IC 自動控溫器
可透過用戶端界面設定期望水溫，若溫度感測器測出水溫低於預期，則開啟予以增溫。  

**實圖**
![](https://i.imgur.com/L1l2X4p.jpg)  

![](https://i.imgur.com/XWWdIlq.jpg)  

**接法**
將產品原溫控電路板移除，透過繼電器控制 110V 電源流通，GPIO 26，繼電器常關。  

加溫控制  
```javascript
if (!!_targetTemp) {
    if (temp < _targetTemp) {
        if (!_bonOn) {
            // bonOn
            console.log('turn bon on');
            _bonOn = true;
            spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/bonOn.py']);
        }
    } else {
        if (!!_bonOn) {
            // bonOff
            console.log('turn bon off');
            _bonOn = false;
            spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/bonOff.py']);
        }
    }
}
```  

/home/pi/Yuan-Tuan-Wei-Yu/python/bonOn.py  
```python
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(26, GPIO.OUT)
GPIO.output(26, GPIO.HIGH)
```  

### 4. PH 值監測
監測水中 PH 值。  

**實圖**
![](https://i.imgur.com/cTMWomf.jpg)  

**感測器: PH-Sensor-E-201-C**
**接法**
參考 [GitHub: e-Gizmo/PH-Sensor-E-201-C](https://github.com/e-Gizmo/PH-Sensor-E-201-C/blob/master/pH_sensor_sample_code/pH_sensor_sample_code.ino)  

感測器傳出訊號為類比訊號，因時間緊迫且無現有類比轉數位訊號模組，故無實作  

### 5. TDS 總溶解固體監測
總溶解固體（英語：Total dissolved solids，縮寫TDS），又稱溶解性固體總量，為觀測水質的一種指標  

**實圖**
![](https://i.imgur.com/aBAukY4.jpg)  

![](https://i.imgur.com/rllCRrH.png)  

**接法**
TTL 接線方式，如上圖，接地、TX 接 RX (GPIO 15)、RX 接 TX (GPIO 14)、5V 電源。  

由於時間緊迫故來不及找出如何讀取數值的方法。  

### 6. 餵魚
將飼料罐開洞並用金屬片堵住洞口，將步進馬達與金屬片固定在一起，透過控制步進馬達達到開關飼料罐洞口的效果，始能將飼料倒入魚缸中。  

**實圖**
![](https://i.imgur.com/WbpVFYV.jpg)  

**馬達: ES08A II**
**接法**
正電、接地、GPIO 21  
```python
import RPi.GPIO as GPIO
import time
pin = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
while 1:
    GPIO.output(pin, True)
    time.sleep(0.01)
    GPIO.output(pin, False)
    time.sleep(0.01)
```  

### 7. 影像監控
透過 Webcam 即時觀看魚缸現況  

**實圖**
![](https://i.imgur.com/Azf0koD.jpg)  

**接法**
將 Webcam 接至 Pi 上 USB port  
透過 `fswebcam` 來進行截圖  
```shell
fswebcam -r 1280x720 image.jpg
```  

## 電路圖
![](https://raw.githubusercontent.com/NCNU-OpenSource/Yuan-Tuan-Wei-Yu/master/%E9%81%A0%E7%AB%AF%E9%A4%B5%E9%AD%9A.jpg)  

## 分工
### 張育瑩
- 功能需求討論
- 系統規劃
- 系統實作
- 接線
- 簡報製作
- 報告
- 文件  

### 蔡富亘
- 功能需求討論
- 設備採買
- 技術顧問  

### 陳炫宇
- 功能需求討論  

後因身體不適無法參與課程  

### 王仁佑
- 題目發想
- 功能需求討論
- 設備採買
- 跑腿
- 電路圖
