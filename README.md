# comments README

在工程上有些传统项目尽管使用了git，但是删除代码的时候并不是直接删除，而是将其注释掉，并添加对应的注释。因此本插件主要是为了自动生成对应的注释

`Ctrl+K D`：生成删除代码时的注释

`Ctrl+K A`：生成添加代码时的注释

## Features

* 支持更多的语言，目前暂时只支持C
* 将注释模板化，可自行填充相关配置
* 可在设置里直接进行配置

## Extension Settings

本插件在 `settings.json`文件里必须的配置为

```json
"comments.userConf": {
    "name": "testA",
    "date": "",		//可不写，不写的话根据当前日期自动生成
    "description": ""	//可不写，不写则不填充
}
```

## Release Notes

### 1.0.0

初始发布
