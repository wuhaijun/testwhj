# 新版首页功能上线二三事

### 1. 修改/views/main.html 文件里面配置的静态服务器地址为线上地址:
```
STATIC_SERVER='http://boom-static.static.cceato.com';

```

### 2. 执行项目根目录下的文件sliders.js并设置slider的版本号, 如: production_1, 配置首页slider数据:
```
> node sliders development_1

```

### 3. 执行项目根目录下的文件viewlog.js, 重构用户访问project日志的数据库结构:
```
> node viewlog

```