# 前端传IP

## 改WebRTC配置

```
WebRTC，名称源自网页即时通信（英语：Web Real-Time Communication）的缩写，是一个支持网页浏览器进行实时语音对话或视频对话的API。它于2011年6月1日开源并在Google、Mozilla、Opera支持下被纳入万维网联盟的W3C推荐标准。

webRTC 是HTML 5 的一个扩展，允许去获取当前客户端的IP地址，可以查看当前网址：net.ipcalf.com/

但如果使用 chrome 浏览器打开，此时可能会看到一串类似于：

e87e041d-15e1-4662-adad-7a6601fca9fb.local

的机器码，这是因为chrome 默认是隐藏掉 内网IP地址的，可以通过修改 chrome 浏览器的配置更改此行为：

1、在chrome 浏览器地址栏中输入：chrome://flags/

2、搜索 #enable-webrtc-hide-local-ips-with-mdns 该配置 并将属性改为disabled

3、点击relaunch 浏览器即可查看到本机的内网IP地址

```
## 加插件
```
WebRTC Network Limiter
```

