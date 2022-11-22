# comments README

在工程上有些传统项目尽管使用了git，但是删除代码的时候并不是直接删除，而是将其注释掉，并添加对应的注释。因此本插件主要是为了自动生成对应的注释

`Ctrl+K D`：生成删除代码时的注释

`Ctrl+K A`：生成添加代码时的注释

## Features

* 支持更多的语言，目前暂时只支持C
* 将注释模板化，可自行填充相关配置

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

### 0.0.1

初始发布

### 0.0.2

* 可在 `设置`里直接跳转到 `settings.json`里进行填写配置
* 修复了删除一行时会多出一个空格的问题
* 修复了添加代码块时注释里没有begin，end的问题

### 0.1.0

* 增加了行内替换字符串功能
* 修改了对应的快捷键，避免和vscode官方产生冲突
